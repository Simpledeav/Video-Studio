import type { CalculateMetadataFunction } from "remotion";
import { Composition } from "remotion";
import { z } from "zod";
import demoEpisodeJson from "../content/demo-episode.json";
import aiAgentEpisodeJson from "../content/episode-ai-agent-guardrails.json";
import legoEpisodeJson from "../content/episode-lego-turnaround.json";
import voiceProfileEpisodeJson from "../content/episode-voice-profile-demo.json";
import { parseEpisode } from "./config/episode.schema";
import { HEIGHT, WIDTH } from "./config/motion";
import { BT } from "./config/bankTransfer";
import {
  DEFAULT_END_CARD_TEMPLATE,
  END_CARD_TEMPLATE_IDS,
} from "./config/brand";
import {
  StickmanStory,
  type StickmanStoryProps,
} from "./compositions/StickmanStory";
import { LegoCaseStudy, LegoCaseStudyWide } from "./compositions/LegoCaseStudy";
import { AirbnbCaseStudy } from "./compositions/AirbnbCaseStudy";
import { AirbnbCover } from "./compositions/AirbnbCover";
import { BlackBerryCaseStudy } from "./compositions/BlackBerryCaseStudy";
import { BlackBerryCover } from "./compositions/BlackBerryCover";
import { CoinbaseCaseStudy } from "./compositions/CoinbaseCaseStudy";
import { PaynovaCaseStudy, PaynovaCaseStudyWide } from "./compositions/PaynovaCaseStudy";
import { DeletedProductionDatabase } from "./compositions/DeletedProductionDatabase";
import { DeletedProductionDatabaseWide } from "./compositions/DeletedProductionDatabaseWide";
import { DeletedProductionDatabaseCover } from "./compositions/DeletedProductionDatabaseCover";
import { AccessControlCaseStudy } from "./compositions/AccessControlCaseStudy";
import { FootballRelationship } from "./compositions/FootballRelationship";
import { BankTransfer, BankTransferWide } from "./compositions/BankTransfer";
import { BankTransferCover } from "./compositions/BankTransferCover";
import { LiquidDeathCaseStudy } from "./compositions/LiquidDeathCaseStudy";
import { LiquidDeathCover } from "./compositions/LiquidDeathCover";
import { PocketLedgerCaseStudy } from "./compositions/PocketLedgerCaseStudy";
import { PocketLedgerCover } from "./compositions/PocketLedgerCover";
import { VoiceProfileDemoWide } from "./compositions/VoiceProfileDemoWide";
import { WalmartChickenCaseStudy } from "./compositions/WalmartChickenCaseStudy";
import { McDonaldsAI } from "./compositions/McdonaldsAI";
import { McDonaldsAICover } from "./compositions/McdonaldsAICover";
import { GarageFlow, GarageFlowWide } from "./compositions/GarageFlow";
import { GarageFlowCover } from "./compositions/GarageFlowCover";
import { GF } from "./config/garageflow";
import {
  EndCardAtlas,
  EndCardAurora,
  EndCardAxis,
  EndCardEditorial,
  EndCardOrbit,
  EndCardWidePreview,
  endCardWidePreviewSchema,
} from "./compositions/EndCardPreview";

const endCardSchema = z.object({
  endCardTemplate: z.enum(END_CARD_TEMPLATE_IDS),
});

const demoEpisode = parseEpisode(demoEpisodeJson);
const aiAgentEpisode = parseEpisode(aiAgentEpisodeJson);
const legoEpisode = parseEpisode(legoEpisodeJson);
const voiceProfileEpisode = parseEpisode(voiceProfileEpisodeJson);

const calculateMetadata: CalculateMetadataFunction<StickmanStoryProps> = ({
  props,
}) => {
  const episode = props.episode ?? demoEpisode;
  return {
    durationInFrames: Math.round(episode.durationSeconds * episode.fps),
    fps: episode.fps,
    width: WIDTH,
    height: HEIGHT,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ========================================================= */}
      {/* WALMART: THE CHICKEN PURSE THAT SOLD OUT IN 90 MINUTES     */}
      {/* ========================================================= */}
      <Composition
        id="WalmartChickenCaseStudy"
        component={WalmartChickenCaseStudy}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ========================================================= */}
      {/* LIQUID DEATH: THE MAN WHO MADE WATER LOOK LIKE BEER        */}
      {/* ========================================================= */}
      <Composition
        id="LiquidDeathCaseStudy"
        component={LiquidDeathCaseStudy}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="LiquidDeathCaseStudyWide"
        component={LiquidDeathCaseStudy}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="LiquidDeathCover"
        component={LiquidDeathCover}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ========================================================= */}
      {/* POCKETLEDGER: THE SMALL IDEA                               */}
      {/* ========================================================= */}
      <Composition
        id="PocketLedgerCaseStudy"
        component={PocketLedgerCaseStudy}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="PocketLedgerCaseStudyWide"
        component={PocketLedgerCaseStudy}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="PocketLedgerCover"
        component={PocketLedgerCover}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ========================================================= */}
      {/* REPLIT INCIDENT: THE DELETED PRODUCTION DATABASE           */}
      {/* ========================================================= */}
      <Composition
        id="DeletedProductionDatabase"
        component={DeletedProductionDatabase}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="DeletedProductionDatabaseWide"
        component={DeletedProductionDatabaseWide}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="DeletedProductionDatabaseCover"
        component={DeletedProductionDatabaseCover}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
      />

      {/* ========================================================= */}
      {/* FOOTBALL RELATIONSHIP COMEDY (84-SECOND EDITORIAL SPOOF)   */}
      {/* ========================================================= */}
      <Composition
        id="FootballRelationship"
        component={FootballRelationship}
        durationInFrames={2520}
        fps={30}
        width={1080}
        height={1920}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />

      {/* ========================================================= */}
      {/* ACCESS CONTROL: ONE MISSING RULE (85-SECOND CASE STUDY)   */}
      {/* ========================================================= */}
      <Composition
        id="AccessControlCaseStudy"
        component={AccessControlCaseStudy}
        durationInFrames={2550}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ========================================================= */}
      {/* BANK TRANSFER: SUCCESSFUL, BUT NOTHING ARRIVED            */}
      {/* ========================================================= */}
      <Composition
        id="BankTransfer"
        component={BankTransfer}
        durationInFrames={BT.durationFrames}
        fps={BT.fps}
        width={BT.portrait.width}
        height={BT.portrait.height}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="BankTransferWide"
        component={BankTransferWide}
        durationInFrames={BT.durationFrames}
        fps={BT.fps}
        width={BT.wide.width}
        height={BT.wide.height}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="BankTransferCover"
        component={BankTransferCover}
        durationInFrames={1}
        fps={BT.fps}
        width={BT.wide.width}
        height={BT.wide.height}
      />

      {/* ========================================================= */}
      {/* McDONALD'S TRIED AI: THE DRIVE-THRU EXPERIMENT            */}
      {/* ========================================================= */}
      <Composition
        id="McDonaldsAI"
        component={McDonaldsAI}
        durationInFrames={2700}
        fps={30}
        width={1080}
        height={1920}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="McDonaldsAIWide"
        component={McDonaldsAI}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="McDonaldsAICover"
        component={McDonaldsAICover}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ========================================================= */}
      {/* GARAGEFLOW: EVERY REPAIR. ONE WORKSPACE.                   */}
      {/* ========================================================= */}
      <Composition
        id="GarageFlow"
        component={GarageFlow}
        durationInFrames={GF.durationFrames}
        fps={GF.fps}
        width={GF.portrait.width}
        height={GF.portrait.height}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="GarageFlowWide"
        component={GarageFlowWide}
        durationInFrames={GF.durationFrames}
        fps={GF.fps}
        width={GF.wide.width}
        height={GF.wide.height}
        schema={endCardSchema}
        defaultProps={{ endCardTemplate: DEFAULT_END_CARD_TEMPLATE }}
      />
      <Composition
        id="GarageFlowCover"
        component={GarageFlowCover}
        durationInFrames={1}
        fps={GF.fps}
        width={GF.wide.width}
        height={GF.wide.height}
      />

      {/* ========================================================= */}
      {/* BRAND END-CARD TEMPLATES (PICK ONE, THEN SET THE DEFAULT)  */}
      {/* ========================================================= */}
      <Composition
        id="EndCardAurora"
        component={EndCardAurora}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EndCardAtlas"
        component={EndCardAtlas}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EndCardAxis"
        component={EndCardAxis}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EndCardEditorial"
        component={EndCardEditorial}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EndCardOrbit"
        component={EndCardOrbit}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EndCardWidePreview"
        component={EndCardWidePreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={endCardWidePreviewSchema}
        defaultProps={{ template: DEFAULT_END_CARD_TEMPLATE }}
      />

      {/* ========================================================= */}
      {/* COINBASE × CURSOR: THE AGENT-FIRST ENGINEERING SHIFT      */}
      {/* ========================================================= */}
      <Composition
        id="CoinbaseCaseStudy"
        component={CoinbaseCaseStudy}
        durationInFrames={2820}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CoinbaseCaseStudyWide"
        component={CoinbaseCaseStudy}
        durationInFrames={2820}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ========================================================= */}
      {/* PAYNOVA: THE $5 MILLION MISTAKE (80-SECOND CASE STUDY)    */}
      {/* ========================================================= */}
      <Composition
        id="PaynovaCaseStudy"
        component={PaynovaCaseStudy}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PaynovaCaseStudyWide"
        component={PaynovaCaseStudyWide}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ========================================================= */}
      {/* BLACKBERRY: WHEN THE FUTURE CHANGED (80-SECOND CASE STUDY) */}
      {/* ========================================================= */}
      <Composition
        id="BlackBerryCaseStudy"
        component={BlackBerryCaseStudy}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BlackBerryCaseStudyWide"
        component={BlackBerryCaseStudy}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BlackBerryCover"
        component={BlackBerryCover}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
      />

      {/* ========================================================= */}
      {/* OTHER SIMPLEDEAV ARCHIVE COMPOSITIONS                     */}
      {/* ========================================================= */}
      <Composition
        id="AirbnbCereal"
        component={AirbnbCaseStudy}
        durationInFrames={2400}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AirbnbCerealCover"
        component={AirbnbCover}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="AirbnbCerealWide"
        component={AirbnbCaseStudy}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LegoCaseStudy"
        component={LegoCaseStudy}
        durationInFrames={Math.round(legoEpisode.durationSeconds * legoEpisode.fps)}
        fps={legoEpisode.fps}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ episode: legoEpisode }}
      />
      <Composition
        id="LegoCaseStudyWide"
        component={LegoCaseStudyWide}
        durationInFrames={Math.round(legoEpisode.durationSeconds * legoEpisode.fps)}
        fps={legoEpisode.fps}
        width={1920}
        height={1080}
        defaultProps={{ episode: legoEpisode }}
      />
      <Composition
        id="StickmanStory"
        component={StickmanStory}
        durationInFrames={Math.round(
          demoEpisode.durationSeconds * demoEpisode.fps,
        )}
        fps={demoEpisode.fps}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ episode: demoEpisode }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="AIAgentGuardrails"
        component={StickmanStory}
        durationInFrames={Math.round(
          aiAgentEpisode.durationSeconds * aiAgentEpisode.fps,
        )}
        fps={aiAgentEpisode.fps}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ episode: aiAgentEpisode }}
        calculateMetadata={calculateMetadata}
      />

      {/* ========================================================= */}
      {/* VOICE PROFILE DEMO — DAVID NIGERIAN ENGLISH               */}
      {/* ========================================================= */}
      <Composition
        id="VoiceProfileDemo"
        component={StickmanStory}
        durationInFrames={Math.round(
          voiceProfileEpisode.durationSeconds * voiceProfileEpisode.fps,
        )}
        fps={voiceProfileEpisode.fps}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ episode: voiceProfileEpisode }}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="VoiceProfileDemoWide"
        component={VoiceProfileDemoWide}
        durationInFrames={Math.round(
          voiceProfileEpisode.durationSeconds * voiceProfileEpisode.fps,
        )}
        fps={voiceProfileEpisode.fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
