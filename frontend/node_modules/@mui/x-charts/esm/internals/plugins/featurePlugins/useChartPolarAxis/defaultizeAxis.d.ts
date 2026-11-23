import { MakeOptional } from '@mui/x-internals/types';
import { ScaleName } from "../../../../models/index.js";
import { PolarAxisConfig } from "../../../../models/axis.js";
import { DatasetType } from "../../../../models/seriesType/config.js";
export declare function defaultizeAxis<TScale extends ScaleName = ScaleName>(inAxis: MakeOptional<PolarAxisConfig<TScale, any>, 'id'>[] | undefined, dataset: Readonly<DatasetType> | undefined, axisName: 'rotation' | 'radius'): PolarAxisConfig<TScale, any>[];