import { LoadingButtonProps } from "../LoadingButton/index.js";
import { TabListProps } from "../TabList/index.js";
import { TabPanelProps } from "../TabPanel/index.js";
import { TimelineConnectorProps } from "../TimelineConnector/index.js";
import { TimelineContentProps } from "../TimelineContent/index.js";
import { TimelineDotProps } from "../TimelineDot/index.js";
import { TimelineItemProps } from "../TimelineItem/index.js";
import { TimelineOppositeContentProps } from "../TimelineOppositeContent/index.js";
import { TimelineProps } from "../Timeline/index.js";
import { TimelineSeparatorProps } from "../TimelineSeparator/index.js";
import { MasonryProps } from "../Masonry/index.js";
export interface LabComponentsPropsList {
  MuiLoadingButton: LoadingButtonProps;
  MuiMasonry: MasonryProps;
  MuiTabList: TabListProps;
  MuiTabPanel: TabPanelProps;
  MuiTimeline: TimelineProps;
  MuiTimelineConnector: TimelineConnectorProps;
  MuiTimelineContent: TimelineContentProps;
  MuiTimelineDot: TimelineDotProps;
  MuiTimelineItem: TimelineItemProps;
  MuiTimelineOppositeContent: TimelineOppositeContentProps;
  MuiTimelineSeparator: TimelineSeparatorProps;
}
declare module '@mui/material/styles' {
  interface ComponentsPropsList extends LabComponentsPropsList {}
}
export {};