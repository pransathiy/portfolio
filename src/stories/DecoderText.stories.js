import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import DecoderText from 'components/DecoderText';
import { StoryContainer } from './StoryContainer';

export default {
  title: 'Decoder text',
  decorators: [withKnobs],
};

export const text = () => (
  <StoryContainer padding={30}>
    <h2 style={{ fontWeight: 500, margin: 0 }}>
      <DecoderText start text="Slick cyberpunk text" />
    </h2>
  </StoryContainer>
);
