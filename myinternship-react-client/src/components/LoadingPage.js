import React from 'react'
import { Dimmer, Loader, Image } from 'semantic-ui-react'
import background from "images/internship.jpg";

export const LoadingPage = (props) => {
  const style = { backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" };
  return (
    <div>
      <div className="app-container" style={style}>
        <Dimmer active>
          <Loader>{props.message ? props.message : "Loading"}</Loader>
        </Dimmer>

        <Image src='/images/wireframe/short-paragraph.png' />
      </div>
    </div>
  )
}

export default LoadingPage;
