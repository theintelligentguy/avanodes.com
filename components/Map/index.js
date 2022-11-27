import React from 'react'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import { useIntl } from "react-intl"

import 'leaflet/dist/leaflet.css'
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export const Map = ({ position, item }) => {
  if (
    position &&
    position.length === 2 &&
    typeof position[0] !== 'undefined' &&
    typeof position[1] !== 'undefined' &&
    position[0] !== null &&
    position[1] !== null
  ) {
    const { formatMessage } = useIntl()
    const f = (id, values = {}) => formatMessage({ id }, values)

    const leafletRef = React.useRef();
    React.useEffect(() => {
      if (leafletRef && leafletRef.current) {
        leafletRef.current.openPopup();
      }
    }, [])

    return (
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker ref={leafletRef} position={position}>
          <Tooltip direction={'right'} permanent={true} interactive={false} className="map-tooltip">
            <div className="row" style={{ minWidth: '350px' }}>
              <div className="col-5 text-right pr-1 col-labels font-weight-bold">
                <div className="mb-1">{f('map.tooltip.title.ip')}</div>
                <div className="mb-1">{f('map.tooltip.title.location')}</div>
                <div className="mb-1">{f('map.tooltip.title.version')}</div>
                <div className="mb-1">{f('map.tooltip.title.country')}</div>
              </div>
              <div className="col-7 text-left pl-1 col-values font-weight-bold">
                <div className="mb-1">{`${item.publicIP}`.split(':')[0]}</div>
                <div className="mb-1">{item.country}, {item.city}</div>
                <div className="mb-1">{item.version}</div>
                <div className="mb-1">{item.country}</div>
                {/* <div className="text-right"><a href="https://test.com">Go to provider >></a></div> */}
              </div>
            </div>
          </Tooltip>
        </Marker>
      </MapContainer>
    )
  }
  return null
}

export default Map
