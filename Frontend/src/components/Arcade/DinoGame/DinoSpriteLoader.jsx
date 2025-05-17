import React, { useEffect, useRef } from 'react';

// This component will load the actual sprite sheet and make it available to the game
const DinoSpriteLoader = ({ onSpriteLoaded }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  
  useEffect(() => {
    // Create an Image element to load the sprite sheet
    const img = new Image();
    imgRef.current = img;
    
    img.onload = () => {
      // Once the image is loaded, process it
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image to the canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to data URL and pass it back
      const dataUrl = canvas.toDataURL('image/png');
      
      // Call the callback with the data URL
      if (onSpriteLoaded) {
        onSpriteLoaded(dataUrl);
      }
      
      // Store the URL in sessionStorage for re-use
      sessionStorage.setItem('dinoSpriteSheet', dataUrl);
    };
    
    // Set the source to the provided sprite image
    // This should be the URL to your actual sprite sheet
    img.src = '/path/to/your/dino-sprite-sheet.png';
    
    // Cleanup function
    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
      }
    };
  }, [onSpriteLoaded]);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: 'none' }} 
      data-testid="dino-sprite-canvas"
    />
  );
};

export default DinoSpriteLoader;