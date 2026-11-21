import type { CSSProperties } from "react";
import Image from "next/image";
import { siAutodesk, siBlender, siUnity, siUnrealengine } from "simple-icons";
import type { WebsiteConfig } from "@/config/schema";

const awsLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg";

const marks = {
  blender: siBlender,
  autodesk: siAutodesk,
  unity: siUnity,
  unreal: siUnrealengine
};

function BrandMark({ icon, name }: { icon: WebsiteConfig["collaborators"]["items"][number]["icon"]; name: string }) {
  if (icon === "aws") {
    return <Image className="aws-wordmark" src={awsLogoUrl} alt="AWS logo" width={72} height={43} unoptimized />;
  }
  if (icon === "autodesk") {
    return <span className="autodesk-wordmark" role="img" aria-label="Autodesk logo"><svg viewBox="0 0 24 24"><path d={siAutodesk.path} /></svg><b>AUTODESK</b></span>;
  }
  const mark = marks[icon];
  return <svg viewBox="0 0 24 24" role="img" aria-label={`${name} logo`}><path d={mark.path} /></svg>;
}

export function Collaborators({ config }: { config: WebsiteConfig["collaborators"] }) {
  if (!config.enabled) return null;
  return (
    <section className="section collaborators-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{config.eyebrow}</span>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
        <div className="collaborator-grid">
          {config.items.map((item) => {
            const mark = item.icon === "aws" ? null : marks[item.icon];
            const color = mark && mark.hex !== "FFFFFF" ? `#${mark.hex}` : "#202b34";
            return (
              <a
                className="collaborator-card"
                href={item.href}
                key={item.name}
                rel="noopener noreferrer"
                style={{ "--collaborator-color": color } as CSSProperties}
                target="_blank"
              >
                <span className="collaborator-mark"><BrandMark icon={item.icon} name={item.name} /></span>
                <span className="collaborator-copy"><strong>{item.name}</strong><small>{item.role}</small></span>
              </a>
            );
          })}
        </div>
        <p className="collaborator-note">{config.note}</p>
      </div>
    </section>
  );
}
