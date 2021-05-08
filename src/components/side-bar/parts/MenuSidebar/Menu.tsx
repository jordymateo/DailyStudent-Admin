
import React from "react";
import { Link } from "react-router-dom";
import "./Menu.scss";
export const Menu: React.FC = () => {
  return (
    <div className="side-navigation">
      <Link to="/"><i className="dx-icon dx-icon-group"></i> Usuarios</Link>
      <Link to="/institutions"><i className="dx-icon dx-icon-home"></i> Instituciones académicas</Link>
      <Link to="/careers"><i className="dx-icon dx-icon-toolbox"></i >Carreras/Pensum</Link>
    </div>
  );
}