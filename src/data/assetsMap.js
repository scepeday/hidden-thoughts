import logoWhite from "../../assets/brand/white-logo.svg";
import collage01 from "../../assets/collage/collage-01.jpg";
import collage02 from "../../assets/collage/collage-02.jpg";
import collage03 from "../../assets/collage/collage-03.jpg";
import collage04 from "../../assets/collage/collage-04.jpg";
import collage05 from "../../assets/collage/collage-05.jpg";
import collage06 from "../../assets/collage/collage-06.jpg";
import collage07 from "../../assets/collage/collage-07.jpg";
import collage08 from "../../assets/collage/collage-08.jpg";
import collage09 from "../../assets/collage/collage-09.jpg";
import introImage from "../../assets/intro/intro-image.jpg";
import grainTexture from "../../assets/web/textures/grain.png";
import noiseTexture from "../../assets/web/textures/noise.png";
import paperTexture from "../../assets/web/textures/paper-texture.jpg";

export const assetsMap = {
  logo: logoWhite,
  introImage,
  collageImages: [
    collage01,
    collage02,
    collage03,
    collage04,
    collage05,
    collage06,
    collage07,
    collage08,
    collage09,
  ],
  noteImages: [
    "/hidden-thoughts/assets/notes/note-01.jpg",
    "/hidden-thoughts/assets/notes/note-02.jpg",
    "/hidden-thoughts/assets/notes/note-03.jpg",
  ],
  textures: {
    grain: grainTexture,
    noise: noiseTexture,
    paper: paperTexture,
  },
  audio: {
    backgroundMusic: "/hidden-thoughts/assets/audio/background-music.mp3",
  },
};
