import { Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useI18n } from '../i18n';

const SettingsPage = () => {
  const { t } = useI18n();
  return (
    <>
      <Heading size="md" mb={4}>
        {t('settings')}
      </Heading>
      <Text>{t('placeholderSettings')}</Text>
    </>
  );
};

export default SettingsPage;