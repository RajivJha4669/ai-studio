import { render, screen } from '@testing-library/react';
import { LiveSummary } from '../LiveSummary';

describe('LiveSummary', () => {
  it('shows empty state when no content is provided', () => {
    render(<LiveSummary imageUrl={null} prompt="" style="Editorial" />);
    
    expect(screen.getByText('Live Summary')).toBeInTheDocument();
    expect(screen.getByText('Upload an image and add a prompt to see your generation summary')).toBeInTheDocument();
  });

  it('displays image when provided', () => {
    const imageUrl = 'data:image/jpeg;base64,test';
    render(<LiveSummary imageUrl={imageUrl} prompt="" style="Editorial" />);
    
    expect(screen.getByText('Live Summary')).toBeInTheDocument();
    expect(screen.getByAltText('Upload preview')).toBeInTheDocument();
    expect(screen.getByAltText('Upload preview')).toHaveAttribute('src', imageUrl);
  });

  it('displays prompt when provided', () => {
    const prompt = 'A beautiful sunset over mountains';
    render(<LiveSummary imageUrl={null} prompt={prompt} style="Editorial" />);
    
    expect(screen.getByText('Live Summary')).toBeInTheDocument();
    expect(screen.getByText('Prompt')).toBeInTheDocument();
    expect(screen.getByText(prompt)).toBeInTheDocument();
  });

  it('displays style when provided', () => {
    render(<LiveSummary imageUrl={null} prompt="" style="Vintage" />);
    
    expect(screen.getByText('Live Summary')).toBeInTheDocument();
    expect(screen.getByText('Style')).toBeInTheDocument();
    expect(screen.getByText('Vintage')).toBeInTheDocument();
  });

  it('displays all content when everything is provided', () => {
    const imageUrl = 'data:image/jpeg;base64,test';
    const prompt = 'A beautiful sunset over mountains';
    const style = 'Artistic';
    
    render(<LiveSummary imageUrl={imageUrl} prompt={prompt} style={style} />);
    
    expect(screen.getByText('Live Summary')).toBeInTheDocument();
    expect(screen.getByAltText('Upload preview')).toBeInTheDocument();
    expect(screen.getByText('Prompt')).toBeInTheDocument();
    expect(screen.getByText(prompt)).toBeInTheDocument();
    expect(screen.getByText('Style')).toBeInTheDocument();
    expect(screen.getByText(style)).toBeInTheDocument();
  });

  it('does not show empty prompt', () => {
    render(<LiveSummary imageUrl={null} prompt="   " style="Editorial" />);
    
    expect(screen.getByText('Live Summary')).toBeInTheDocument();
    expect(screen.queryByText('Prompt')).not.toBeInTheDocument();
  });
});
