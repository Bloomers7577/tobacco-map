"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import taxes from "../taxes.json";
import { Tooltip } from "./Tooltip";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const geoUrl = "/f.json";

const colorScale = scaleLinear<string>()
  .domain([0, 1])
  .range(["#ffedea", "#ff5233"]);

const MapChart = () => {
  const countryChecked = useRef<boolean>(false);
  const [visibility, setVisibility] = useState(false);

  const [country, setCountry] = useState<
    ArrayElement<typeof taxes> | undefined
  >(undefined);

  const renderContent = (input: ArrayElement<typeof taxes> | undefined) => {
    const data = {
      ...input,
      effectiveTaxRate: input?.["total-tax"] ?? "unknown",
      LastTaxRateYear: input?.["last-tax-rate-year"] ?? "unknown",
    };

    return (
      <>
        <div style={headerStyle}>{data.country ?? "unknown"}</div>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            Effective tax rate: {data.effectiveTaxRate}
          </li>
          {/* <li style={listItemStyle}>
            Rely on a uniform specific excise tax: {data.relyOnUniformExciseTax}
          </li>
          <li style={listItemStyle}>
            Inflation adjustment mechanism: {data.inflationAdjustment}
          </li>
          <li style={listItemStyle}>
            Stamp/marking system: {data.markingSystem}
          </li>
          <li style={listItemStyle}>
            % GDP per capita to buy: {data.gdpPerCapita}
          </li>
          <li style={listItemStyle}>
            Tobacconomics tax score: {data.tobacconomicsScore}
          </li>
          <li style={listItemStyle}>
            Tobacconomics global ranking: {data.tobacconomicsRanking}
          </li> */}
        </ul>
      </>
    );
  };

  const headerStyle = {
    background: "rgb(47, 47, 47)",
    padding: "10px",
    color: "white",
  };

  const listStyle = {
    listStyleType: "none",
    padding: "10px",
    margin: 0,
  };

  const listItemStyle = {
    marginBottom: "3px",
  };

  return (
    <div className="min-w-full outline outline-1">
      <Tooltip visibility={visibility}>{renderContent(country)}</Tooltip>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
      >
        <ZoomableGroup center={[0, 0]} zoom={9}>
          <Sphere
            stroke="#E4E5E6"
            strokeWidth={0.5}
            id="rsm-sphere"
            fill="transparent"
          />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />

          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const hoverCountry = taxes.find((taxes) => {
                  return taxes.country === geo.properties.name;
                });
                return (
                  <Geography
                    onMouseMove={(event) => {
                      if (
                        countryChecked.current === false &&
                        country !== hoverCountry?.country
                      ) {
                        countryChecked.current = true;
                        setCountry(hoverCountry);
                      }
                      setVisibility(true);
                    }}
                    onMouseLeave={() => {
                      countryChecked.current = false;
                      setVisibility(false);
                    }}
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#E4E5E6"
                    strokeWidth={0.1}
                    strokeOpacity={0.2}
                    fill={
                      hoverCountry?.["total-tax"]
                        ? colorScale(hoverCountry?.["total-tax"])
                        : "#F5F4F6"
                    }
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
