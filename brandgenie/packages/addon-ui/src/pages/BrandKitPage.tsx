import {
  Heading,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Box,
  Tag,
  SimpleGrid,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { fileToBase64 } from '../utils/fileToBase64';
// @ts-ignore – Express add-on SDK is injected in runtime
declare const addOnUISdk: any;

type AnalysisResult = {
  palette: string[] | null;
  fonts: string[] | null;
};

const BrandKitPage = () => {
  const toast = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzerBase = import.meta.env.VITE_ANALYZER_URL || 'http://localhost:8787';

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setAnalysis(null);
      let result: AnalysisResult = { palette: null, fonts: null };

      if (logoFile) {
        const base64 = await fileToBase64(logoFile);
        const res = await fetch(`${analyzerBase}/analyze/logo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });
        result = await res.json();
      } else if (websiteUrl) {
        const res = await fetch(`${analyzerBase}/analyze/url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: websiteUrl }),
        });
        result = await res.json();
      }

      setAnalysis(result);
    } catch (err) {
      console.error(err);
      toast({ status: 'error', description: 'Analysis failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKit = async () => {
    try {
      if (!analysis?.palette?.length) {
        toast({ status: 'warning', description: 'Run analysis first' });
        return;
      }

      const runtime = addOnUISdk.instance.runtime;
      const brandKit = await runtime.brandKits.create({ name: 'BrandGenie Kit' });

      await Promise.all(
        analysis.palette.map((hex: string) => runtime.brandKits.addColor(brandKit.id, { hex })),
      );

      if (analysis.fonts?.length) {
        await runtime.brandKits.addFonts(brandKit.id, analysis.fonts.slice(0, 3));
      }

      if (logoFile) {
        const base64 = await fileToBase64(logoFile);
        await runtime.brandKits.uploadLogo(brandKit.id, base64);
      }

      toast({ status: 'success', description: 'Brand Kit created!' });
    } catch (err) {
      console.error(err);
      toast({ status: 'error', description: 'Failed to create kit' });
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Heading size="md">Brand Kit Generator</Heading>

      <FormControl>
        <FormLabel>Upload Logo</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        />
      </FormControl>

      <HStack>
        <FormControl>
          <FormLabel>or Website URL</FormLabel>
          <Input
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleAnalyze} colorScheme="brand" isLoading={loading}>
          Analyze
        </Button>
      </HStack>

      {analysis && (
        <>
          {analysis.palette && (
            <Box>
              <Heading size="sm" mb={2}>
                Palette
              </Heading>
              <HStack>
                {analysis.palette.map((c) => (
                  <Box key={c} w="32px" h="32px" bg={c} borderRadius="md" />
                ))}
              </HStack>
            </Box>
          )}
          {analysis.fonts && (
            <Box>
              <Heading size="sm" mb={2}>
                Fonts
              </Heading>
              <SimpleGrid columns={3} spacing={2}>
                {analysis.fonts.map((f) => (
                  <Tag key={f}>{f}</Tag>
                ))}
              </SimpleGrid>
            </Box>
          )}
          <Button colorScheme="green" onClick={handleCreateKit} mt={4}>
            Create Brand Kit
          </Button>
        </>
      )}
      {loading && <Spinner />}
    </VStack>
  );
};

export default BrandKitPage;