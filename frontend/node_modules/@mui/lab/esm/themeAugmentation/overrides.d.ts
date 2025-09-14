import { LoadingButtonClassKey } from "../LoadingButton/index.js";
import { MasonryClassKey } from "../Masonry/index.js";
import { TabListClassKey } from "../TabList/index.js";
import { TabPanelClassKey } from "../TabPanel/index.js";
import { TimelineClassKey } from "../Timeline/index.js";
import { TimelineConnectorClassKey } from "../TimelineConnector/index.js";
import { TimelineContentClassKey } from "../TimelineContent/index.js";
import { TimelineDotClassKey } from "../TimelineDot/index.js";
import { TimelineItemClassKey } from "../TimelineItem/index.js";
import { TimelineOppositeContentClassKey } from "../TimelineOppositeContent/index.js";
import { TimelineSeparatorClassKey } from "../TimelineSeparator/index.js";
export interface LabComponentNameToClassKey {
  MuiLoadingButton: LoadingButtonClassKey;
  MuiMasonry: MasonryClassKey;
  MuiTabList: TabListClassKey;
  MuiTabPanel: TabPanelClassKey;
  MuiTimeline: TimelineClassKey;
  MuiTimelineConnector: TimelineConnectorClassKey;
  MuiTimelineContent: TimelineContentClassKey;
  MuiTimelineDot: TimelineDotClassKey;
  MuiTimelineItem: TimelineItemClassKey;
  MuiTimelineOppositeContent: TimelineOppositeContentClassKey;
  MuiTimelineSeparator: TimelineSeparatorClassKey;
}
declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends LabComponentNameToClassKey {}
}
export {};