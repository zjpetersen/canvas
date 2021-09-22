import React from 'react';
import './style/Home.css';

class UploadArtworkInstructions extends React.Component {

  render() {
    let result = 
      <div className="row">
        <div className="column left">

        </div>
        <div className="column middle">
          <h2>How to Upload Artwork</h2>

          <p>
            So you've bought a tile, congrats!
            As a tile owner, you'll allowed to update the existing artwork (but not required to).
            To do so, follow the below steps:
            </p>
          <h3>Upload Single Tile</h3>

          <p>
            <ol>
              <li>Navigate to your tile: For example, for <a href="/tile/100">tile 100</a>.</li>
              <li>You should see some information at the bottom of the screen, including a 'Choose File' button.</li>
              <li>Click the button and select a 16x16 image from your files. Supported formats are png, jpg, and gif. </li>
              <li>Click the 'Upload Artwork' button to submit your artwork to the network.</li>
              <li>Once the transaction is confirmed you will see your artwork added to the Canvas!</li>
            </ol>
          </p>

          <h3>Bulk Uploading</h3>
          <p>
            Alternatively, you can upload multiple images at once if you have multiple tiles.  This feature is still experimental, and there are not as many safety checks.  Make sure to upload valid images or your transaction may be rejected.
            <ol>
              <li>Click the 'Toggle To Bulk Update Mode' button.</li>
              <li>Upload all of your images in order.  If you accidentally upload in the wrong order or upload an incorrect image please refresh and start again.</li>
              <li>List the tile ids you want updated in order, separated by commas.  The image at position 0 will be the first tile id in the list, position 1 will be the second tile id in the list, and so on.</li>
              <li>Click the 'Upload Artwork' button to submit your artwork to the network.</li>
              <li>Once the transaction is confirmed, refresh the page to see your new artwork.</li>
            </ol>
          </p>

          <h3>Still have questions?</h3>
          <p>
            Reach out to us on <a href="https://twitter.com/EtherCanvasNFT">Twitter</a> and we'd be happy to help.
          </p>
        </div>
        <div className="column right">

        </div>

      </div>
    return result;
  }
}

export default UploadArtworkInstructions;
/*
 "How to Upload Artwork

So you've bought a tile, congrats!
As a tile owner, you'll allowed to update the existing artwork (but not required to).
To do so, follow the below steps:

1. Navigate to ethercanvas.io/canvas
2. Click on your tile.  If you can't find it you can click the 'Show Utilities' button and click 'Highlight Tile' or 'Highlight Owned Tiles' to locate it. Alternatively, you can also navigate to ethercanvas.io/tile/<tideId> (where <tileId> is a number from 0-7055).
3. After clicking on your tile you should see some information at the bottom of the screen, including a 'Choose File' button.
4. Click the button and select a 16x16 image from your files. Supported formats are png, jpg, and gif. 
5. Next, click the 'Upload Artwork' button to submit your artwork to the network.
6. Once the transaction is confirmed you will see your artwork added to the Canvas!

Bulk Uploading:
Alternatively, you can upload multiple images at once if you have multiple tiles.  This feature is still experimental, and there are not as many safety checks, so make sure to upload valid images or your transaction may be rejected.
1. Click the 'Toggle To Bulk Update Mode' button.
2. Upload all of your images in order.  If you accidentally upload in the wrong order or upload an incorrect image please refresh and start again.
3. List the tile ids you want updated in order, separated by commas.  The image at position 0 will be the first tile id in the list, position 1 will be the second tile id in the list, and so on.
4. Click the 'Upload Artwork' button to submit your artwork to the network.
5. Once the transaction is confirmed, refresh the page to see your new artwork" 
 */