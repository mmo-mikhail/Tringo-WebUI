import * as React from 'react';
import { Marker } from 'google-maps-react';

export class Point {
    constructor(public x: number, public y: number) { };
    equals = (other: Point): boolean => other.x === this.x && other.y === this.y;
}

export class Size {
    constructor(public width: number, public height: number) { }
    equals = (other: Size): boolean => other.height === this.height && other.width === this.width;
}


export const diplayMarker = (): any =>
    <Marker
        // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.shape
        label={{
            // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel 
            text: "$ 200"
        }}
        icon={{
            url: "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAC0AAAAeCAYAAAC49JeZAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA7wDvAO/BzIMFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wgNCggb0TWWogAABIFJREFUWMPt101sVFUUB/D/ufe9N59N58NOKUylWGno9ANKi2BDFxpCAY0fceESEjZGMTFsUBITTYy6UYxLd8YtRqOgK1tYoBAQkA6DtDMEWkbmq8O0djqdee/e40KRIE0w0rQ16X9xVy83v3fuOTe5BACx9hgSVxJYv77t8Wq1+qLW+llmbgdQD0ACYCxeCIACMEVECSnlMcuyvhobG03FYh1IJC6D2ttjsCzTOzU1vc+27deZOQjgLIDTAG4w89xio4nIDaAFwDYAW4ho0jCMTwOBwOeO41QM0zT9pVLpXdt2XgXwAxG9b1nmz+VypSqlWETr3TAzlFLwer0u27a3MPNh27aPlEql1lAw+A6tW/fYwWq1+gGAbw1DvuI4qmCaJur8fsQvx5cEDQBdnV2Ynp6G7TgwDKPBcZzPAOx2WdYhikabrymlAlLKQQBnA4EA4vGRJcP+M319W5DJZABgm1LqeyllQWitW4hoQgqR2rZ167ICA8C5c2exsbsbhmEkiSjNzK2CmQmAAyJ99MujS22cN8e/Ow4hhAbgEEBLM2n/PcQA/m9oYAW9gl5BL4+soFfQ84cBQBCRBmAxs+zd3LvUqHmzaVMPtNYSgAVACSHEr8y8VmvdmclmEYt1LLXxnrS1tSGXy8FxnC5mbhZCJGQ4/MicUmoPM7dKKU+Wy+WpYDCESCSCgYEBXL16ddGh+/buRXm2Ap/Ph0qlAinlOq31x0S02uVyvU19vX2ufKFw0LbttwAkiOhDIcSJTCZbCoWCIKIFwxARfD4fkskxrFkThVJq3u+YGdlsFo82NweV1k8x85sANlim+V5DJPIJdXd1w+3xmPl8/nnbtg9qrTcASAI4D+A6EVWxMG9ETUTxiYnxof7+fqTTv0WVUs8BMHDvhUDM7AawFkAvgFYhxBXDMD5qjES+qczNOQQAXV3duHXrFhoaGkKVSmW7UuppZh1jRuivTR+q3ARAM7cAyEspXtCa40KIbqXUMAC/EGKMme+UnQE4ACaFEAnDkENut+dUoVAorlrViJGRkbuYnTt3Ynx8AjMzM7h5cwI9PT3W7GzFLYWQC9AXmJ2dfblWqx0BcEJKuV8IMWPb9kkiWuP3+/dIIVJ3/pA1K5fbPXfx4oVaNNoMv9+H1U2rMTQ89HcR7uunHTt2IJ8voFarQUrxcM1Bfy5ut9sqFAqHbds+BGBISvmGVuoAAwdcLtc+wzC+sEwTIAJrDcMwEAqFMHxi+L65Wrgpe0A6OzphWpb79u3br9VqtcMAJojolNZ6v2EYJ4PB4Eter3fm9OmfHrjXwx/9v0wun0M4HHY6YrEzk8XiL1rrfmZ+BoCLmaOO49yIx0cuDA7uQiqVXB5oAMjnc3B7PFwsFpP19fXHtNaTzBxl5iZm3tzYGDk3Ojo6vmnjRqTT6eWBBoBMJoOB7dsxWSyWr11L/djU1HQMwHVmjiqld9fV1SWV1uO7BnfxpUuXlgcaAJKpJIrFSfQ/2Y9yuTyVy+fPRCKRr5VSaSJ6wuPx/B4Oh7PxeHzeK+APyUcFOD18KrQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMTNUMTA6MDg6MjctMDQ6MDAjvJMAAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTEzVDEwOjA4OjI3LTA0OjAwUuErvAAAAABJRU5ErkJggg==",
            labelOrigin: new Point(22, 12),
            anchor: new Point(35, 45),
            //scaledSize: new Size(45,30)
        }}
        position={{
            lat: 47.7062,
            lng: -122.3321
        }}
    />;


export class PriceTagMarker2 extends React.Component<any, any> {
    render() {
        return (
            <Marker
                // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.shape
                label={{
                    // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel 
                    text: "$ 200"
                }}
                zIndex={1000}
                icon={{
                    url: "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAC0AAAAeCAYAAAC49JeZAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA7wDvAO/BzIMFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wgNCggb0TWWogAABIFJREFUWMPt101sVFUUB/D/ufe9N59N58NOKUylWGno9ANKi2BDFxpCAY0fceESEjZGMTFsUBITTYy6UYxLd8YtRqOgK1tYoBAQkA6DtDMEWkbmq8O0djqdee/e40KRIE0w0rQ16X9xVy83v3fuOTe5BACx9hgSVxJYv77t8Wq1+qLW+llmbgdQD0ACYCxeCIACMEVECSnlMcuyvhobG03FYh1IJC6D2ttjsCzTOzU1vc+27deZOQjgLIDTAG4w89xio4nIDaAFwDYAW4ho0jCMTwOBwOeO41QM0zT9pVLpXdt2XgXwAxG9b1nmz+VypSqlWETr3TAzlFLwer0u27a3MPNh27aPlEql1lAw+A6tW/fYwWq1+gGAbw1DvuI4qmCaJur8fsQvx5cEDQBdnV2Ynp6G7TgwDKPBcZzPAOx2WdYhikabrymlAlLKQQBnA4EA4vGRJcP+M319W5DJZABgm1LqeyllQWitW4hoQgqR2rZ167ICA8C5c2exsbsbhmEkiSjNzK2CmQmAAyJ99MujS22cN8e/Ow4hhAbgEEBLM2n/PcQA/m9oYAW9gl5BL4+soFfQ84cBQBCRBmAxs+zd3LvUqHmzaVMPtNYSgAVACSHEr8y8VmvdmclmEYt1LLXxnrS1tSGXy8FxnC5mbhZCJGQ4/MicUmoPM7dKKU+Wy+WpYDCESCSCgYEBXL16ddGh+/buRXm2Ap/Ph0qlAinlOq31x0S02uVyvU19vX2ufKFw0LbttwAkiOhDIcSJTCZbCoWCIKIFwxARfD4fkskxrFkThVJq3u+YGdlsFo82NweV1k8x85sANlim+V5DJPIJdXd1w+3xmPl8/nnbtg9qrTcASAI4D+A6EVWxMG9ETUTxiYnxof7+fqTTv0WVUs8BMHDvhUDM7AawFkAvgFYhxBXDMD5qjES+qczNOQQAXV3duHXrFhoaGkKVSmW7UuppZh1jRuivTR+q3ARAM7cAyEspXtCa40KIbqXUMAC/EGKMme+UnQE4ACaFEAnDkENut+dUoVAorlrViJGRkbuYnTt3Ynx8AjMzM7h5cwI9PT3W7GzFLYWQC9AXmJ2dfblWqx0BcEJKuV8IMWPb9kkiWuP3+/dIIVJ3/pA1K5fbPXfx4oVaNNoMv9+H1U2rMTQ89HcR7uunHTt2IJ8voFarQUrxcM1Bfy5ut9sqFAqHbds+BGBISvmGVuoAAwdcLtc+wzC+sEwTIAJrDcMwEAqFMHxi+L65Wrgpe0A6OzphWpb79u3br9VqtcMAJojolNZ6v2EYJ4PB4Eter3fm9OmfHrjXwx/9v0wun0M4HHY6YrEzk8XiL1rrfmZ+BoCLmaOO49yIx0cuDA7uQiqVXB5oAMjnc3B7PFwsFpP19fXHtNaTzBxl5iZm3tzYGDk3Ojo6vmnjRqTT6eWBBoBMJoOB7dsxWSyWr11L/djU1HQMwHVmjiqld9fV1SWV1uO7BnfxpUuXlgcaAJKpJIrFSfQ/2Y9yuTyVy+fPRCKRr5VSaSJ6wuPx/B4Oh7PxeHzeK+APyUcFOD18KrQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMTNUMTA6MDg6MjctMDQ6MDAjvJMAAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTEzVDEwOjA4OjI3LTA0OjAwUuErvAAAAABJRU5ErkJggg==",
                    labelOrigin: new Point(22, 12),
                    anchor: new Point(35, 45),
                    //scaledSize: new Size(45,30)
                }}
                position={{
                    lat: 47.6062,
                    lng: -122.3321
                }}
            />
        );
    }
}
