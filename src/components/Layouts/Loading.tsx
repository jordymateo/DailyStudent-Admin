import React, { useEffect, useState } from 'react';
import Images from '../../assets/images';

const Loading = () => {
  const initialText = 'Cargando..';
  const [ text, setText ] = useState<string>(initialText);

  useEffect(() => {
    var loop = setInterval(() => {
      if (text === initialText)
        setText(text + '.');
      else
        setText(initialText);
    }, 600);
    return () => {
      clearInterval(loop);
    }
  });

  return (
    <div className="body-section">
      <img className="bg-shape-top" src={Images.BgShapeTop} />
      <div style={{ textAlign: 'center' }}>
        <img className="loading-logo" src={Images.Logo} alt="loading page" />
        <h2>{text}</h2>
      </div>
      <img className="bg-shape-bottom" src={Images.BgShapeBotton} />
    </div>
  );
}

export default Loading;