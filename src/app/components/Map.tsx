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
import taxes from "../../tax.json";
import { Tooltip } from "./Tooltip";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const headerStyle = {
  background: "rgb(47, 47, 47)",
  padding: "10px",
  color: "white",
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const textColor = (text?: string | null) => {
  const text2 = text?.toLowerCase().trim() ?? "unknown";
  let className: string;

  if (text2 === "yes") {
    className = "text-green-500";
  } else if (text2 === "no") {
    className = "text-red-500";
  } else className = "text-black";

  return <span className={className}>{capitalizeFirstLetter(text2)}</span>;
};

const geoUrl = "/f.json";

const colorScale = (num: number, a = "#ffedea", b = "#ff5233") =>
  scaleLinear<string>().domain([0, 1]).range([a, b])(num);

const renderContent = (input: ArrayElement<typeof taxes> | undefined) => {
  const listItemStyle = {
    marginBottom: "3px",
  };

  return (
    <>
      <div style={headerStyle}>{input?.country ?? "Unknown"}</div>
      <ul className="list-none p-2.5 m-0">
        <li
          style={{
            marginBottom: "3px",
          }}
        >
          Effective tax rate:{" "}
          <span
            style={{
              color: input?.TotalTax
                ? colorScale(1 - input?.TotalTax, "green", "red")
                : "black",
            }}
          >
            {input?.TotalTax ?? "Unknwon"}
          </span>
        </li>
        <li>
          Rely on a uniform specific excise tax:{" "}
          {textColor(input?.RelayOnSpecificExcise ? "Yes" : "No")}
        </li>
        <li style={listItemStyle}>
          Inflation adjustment mechanism:{" "}
          {textColor(input?.inflationAdjustment)}
        </li>
        <li style={listItemStyle}>
          Stamp/marking system: {textColor(input?.taxStamps)}
        </li>
        {/* <li style={listItemStyle}>
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

const MapChart = () => {
  const countryChecked = useRef<boolean>(false);
  const [visibility, setVisibility] = useState(false);

  const [country, setCountry] = useState<
    ArrayElement<typeof taxes> | undefined
  >(undefined);

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
                    strokeWidth={0.15}
                    strokeOpacity={0.2}
                    fill={
                      hoverCountry?.TotalTax
                        ? colorScale(1 - hoverCountry?.TotalTax)
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
