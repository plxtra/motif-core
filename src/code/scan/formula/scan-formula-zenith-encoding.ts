import { Currency, CurrencyId, DataMarket, Exchange, MarketBoard, MarketsService, ZenithConvert, ZenithEncodedScanFormula, ZenithProtocolCommon } from '../../adi/internal-api';
import { StringId, Strings } from '../../res/internal-api';
import {
    AssertInternalError,
    EnumInfoOutOfOrderError,
    Err,
    Integer,
    Ok,
    Result,
    SourceTzOffsetDate,
    UnreachableCaseError
} from "../../sys/internal-api";
import { ScanFormula } from './scan-formula';

export class ScanFormulaZenithEncodingService {
    constructor(private readonly _marketsService: MarketsService) {

    }

    encodeBoolean(node: ScanFormula.BooleanNode): ZenithEncodedScanFormula.BooleanTupleNode {
        return this.encodeBooleanNode(node);
    }

    tryDecodeBoolean(node: ZenithEncodedScanFormula.BooleanTupleNode, strict: boolean): Result<ScanFormulaZenithEncodingService.DecodedBoolean, ScanFormulaZenithEncodingService.DecodedError> {
        const progress = new ScanFormulaZenithEncodingService.DecodeProgress();

        const tryResult = this.tryDecodeExpectedBooleanNode(node, strict, progress);

        if (tryResult.isOk()) {
            const decodedBoolean: ScanFormulaZenithEncodingService.DecodedBoolean = {
                node: tryResult.value,
                progress,
            };
            return new Ok(decodedBoolean);
        } else {
            const decodedError: ScanFormulaZenithEncodingService.DecodedError = {
                error: tryResult.error,
                progress,
            }
            return new Err(decodedError);
        }
    }

    encodeNumeric(node: ScanFormula.NumericNode): ZenithEncodedScanFormula.NumericTupleNode | ZenithEncodedScanFormula.NumericRangeFieldTupleNodeType {
        return this.encodeNumericNode(node);
    }

    tryDecodeNumeric(node: ZenithEncodedScanFormula.NumericTupleNode, strict: boolean): Result<ScanFormulaZenithEncodingService.DecodedNumeric, ScanFormulaZenithEncodingService.DecodedError> {
        const progress = new ScanFormulaZenithEncodingService.DecodeProgress();

        const tryResult = this.tryDecodeExpectedArithmeticNumericNode(node, strict, progress);

        if (tryResult.isOk()) {
            const decodedNumeric: ScanFormulaZenithEncodingService.DecodedNumeric = {
                node: tryResult.value,
                progress,
            };
            return new Ok(decodedNumeric);
        } else {
            const decodedError: ScanFormulaZenithEncodingService.DecodedError = {
                error: tryResult.error,
                progress,
            }
            return new Err(decodedError);
        }
    }

    private encodeBooleanNode(node: ScanFormula.BooleanNode): ZenithEncodedScanFormula.BooleanTupleNode {
        switch (node.typeId) {
            case ScanFormula.NodeTypeId.Not: return this.encodeSingleOperandBooleanNode(ZenithEncodedScanFormula.NotTupleNodeType, node as ScanFormula.SingleOperandBooleanNode);
            case ScanFormula.NodeTypeId.Xor: return this.encodeLeftRightOperandBooleanNode(ZenithEncodedScanFormula.XorTupleNodeType, node as ScanFormula.LeftRightOperandBooleanNode);
            case ScanFormula.NodeTypeId.And: return this.encodeMultiOperandBooleanNode(ZenithEncodedScanFormula.AndTupleNodeType, node as ScanFormula.MultiOperandBooleanNode);
            case ScanFormula.NodeTypeId.Or: return this.encodeMultiOperandBooleanNode(ZenithEncodedScanFormula.OrTupleNodeType, node as ScanFormula.MultiOperandBooleanNode);
            case ScanFormula.NodeTypeId.NumericEquals: return this.encodeNumericComparisonNode(ZenithEncodedScanFormula.EqualTupleNodeType, node as ScanFormula.NumericComparisonBooleanNode);
            case ScanFormula.NodeTypeId.NumericGreaterThan: return this.encodeNumericComparisonNode(ZenithEncodedScanFormula.GreaterThanTupleNodeType, node as ScanFormula.NumericComparisonBooleanNode);
            case ScanFormula.NodeTypeId.NumericGreaterThanOrEqual: return this.encodeNumericComparisonNode(ZenithEncodedScanFormula.GreaterThanOrEqualTupleNodeType, node as ScanFormula.NumericComparisonBooleanNode);
            case ScanFormula.NodeTypeId.NumericLessThan: return this.encodeNumericComparisonNode(ZenithEncodedScanFormula.LessThanTupleNodeType, node as ScanFormula.NumericComparisonBooleanNode);
            case ScanFormula.NodeTypeId.NumericLessThanOrEqual: return this.encodeNumericComparisonNode(ZenithEncodedScanFormula.LessThanOrEqualTupleNodeType, node as ScanFormula.NumericComparisonBooleanNode);
            case ScanFormula.NodeTypeId.All: return [ZenithEncodedScanFormula.AllTupleNodeType];
            case ScanFormula.NodeTypeId.None: return [ZenithEncodedScanFormula.NoneTupleNodeType];
            case ScanFormula.NodeTypeId.Is: return this.encodeIsNode(node as ScanFormula.IsNode);
            case ScanFormula.NodeTypeId.FieldHasValue: return this.encodeFieldHasValueNode(node as ScanFormula.FieldHasValueNode);
            // case ScanFormula.NodeTypeId.BooleanFieldEquals: return encodeBooleanFieldEqualsNode(node as ScanFormula.BooleanFieldEqualsNode);
            case ScanFormula.NodeTypeId.NumericFieldEquals: return this.encodeNumericFieldEqualsNode(node as ScanFormula.NumericFieldEqualsNode);
            case ScanFormula.NodeTypeId.NumericFieldInRange: return this.encodeNumericFieldInRangeNode(node as ScanFormula.NumericFieldInRangeNode);
            case ScanFormula.NodeTypeId.DateFieldEquals: return this.encodeDateFieldEqualsNode(node as ScanFormula.DateFieldEqualsNode);
            case ScanFormula.NodeTypeId.DateFieldInRange: return this.encodeDateFieldInRangeNode(node as ScanFormula.DateFieldInRangeNode);
            case ScanFormula.NodeTypeId.StringFieldOverlaps: return this.encodeStringFieldOverlapsNode(node as ScanFormula.StringFieldOverlapsNode);
            case ScanFormula.NodeTypeId.CurrencyFieldOverlaps: return this.encodeCurrencyFieldOverlapsNode(node as ScanFormula.CurrencyFieldOverlapsNode);
            case ScanFormula.NodeTypeId.ExchangeFieldOverlaps: return this.encodeExchangeFieldOverlapsNode(node as ScanFormula.ExchangeFieldOverlapsNode);
            case ScanFormula.NodeTypeId.MarketFieldOverlaps: return this.encodeMarketFieldOverlapsNode(node as ScanFormula.MarketFieldOverlapsNode);
            case ScanFormula.NodeTypeId.MarketBoardFieldOverlaps: return this.encodeMarketBoardFieldOverlapsNode(node as ScanFormula.MarketBoardFieldOverlapsNode);
            case ScanFormula.NodeTypeId.TextFieldEquals: return this.encodeTextFieldEqualsNode(node as ScanFormula.TextFieldEqualsNode);
            case ScanFormula.NodeTypeId.TextFieldContains: return this.encodeTextFieldContainsNode(node as ScanFormula.TextFieldContainsNode);
            case ScanFormula.NodeTypeId.PriceSubFieldHasValue: return this.encodePriceSubFieldHasValueNode(node as ScanFormula.PriceSubFieldHasValueNode);
            case ScanFormula.NodeTypeId.PriceSubFieldEquals: return this.encodePriceSubFieldEqualsNode(node as ScanFormula.PriceSubFieldEqualsNode);
            case ScanFormula.NodeTypeId.PriceSubFieldInRange: return this.encodePriceSubFieldInRangeNode(node as ScanFormula.PriceSubFieldInRangeNode);
            case ScanFormula.NodeTypeId.DateSubFieldHasValue: return this.encodeDateSubFieldHasValueNode(node as ScanFormula.DateSubFieldHasValueNode);
            case ScanFormula.NodeTypeId.DateSubFieldEquals: return this.encodeDateSubFieldEqualsNode(node as ScanFormula.DateSubFieldEqualsNode);
            case ScanFormula.NodeTypeId.DateSubFieldInRange: return this.encodeDateSubFieldInRangeNode(node as ScanFormula.DateSubFieldInRangeNode);
            case ScanFormula.NodeTypeId.AltCodeSubFieldHasValue: return this.encodeAltCodeSubFieldHasValueNode(node as ScanFormula.AltCodeSubFieldHasValueNode);
            case ScanFormula.NodeTypeId.AltCodeSubFieldContains: return this.encodeAltCodeSubFieldContainsNode(node as ScanFormula.AltCodeSubFieldContainsNode);
            case ScanFormula.NodeTypeId.AttributeSubFieldHasValue: return this.encodeAttributeSubFieldHasValueNode(node as ScanFormula.AttributeSubFieldHasValueNode);
            case ScanFormula.NodeTypeId.AttributeSubFieldContains: return this.encodeAttributeSubFieldContainsNode(node as ScanFormula.AttributeSubFieldContainsNode);
            default:
                throw new UnreachableCaseError('ZSCCFBN90042', node.typeId)
        }
    }

    private encodeMultiOperandBooleanNode(
        type: typeof ZenithEncodedScanFormula.AndTupleNodeType | typeof ZenithEncodedScanFormula.OrTupleNodeType,
        node: ScanFormula.MultiOperandBooleanNode
    ): ZenithEncodedScanFormula.LogicalTupleNode {
        const operands = node.operands;
        const count = operands.length;
        const params = new Array<ZenithEncodedScanFormula.BooleanParam>(count);
        for (let i = 0; i < count; i++) {
            const operand = operands[i];
            const tupleNode = this.encodeBooleanNode(operand);
            params[i] = tupleNode;
        }

        return [type, ...params];
    }

    private encodeSingleOperandBooleanNode(type: typeof ZenithEncodedScanFormula.NotTupleNodeType, node: ScanFormula.SingleOperandBooleanNode): ZenithEncodedScanFormula.LogicalTupleNode {
        const param = this.encodeBooleanNode(node.operand);
        return [type, param];
    }

    private encodeLeftRightOperandBooleanNode(type: typeof ZenithEncodedScanFormula.XorTupleNodeType, node: ScanFormula.LeftRightOperandBooleanNode): ZenithEncodedScanFormula.LogicalTupleNode {
        const leftParam = this.encodeBooleanNode(node.leftOperand);
        const rightParam = this.encodeBooleanNode(node.rightOperand);
        return [type, leftParam, rightParam];
    }

    private encodeNumericNode(node: ScanFormula.NumericNode): ZenithEncodedScanFormula.NumericTupleNode | ZenithEncodedScanFormula.NumericRangeFieldTupleNodeType {
        switch (node.typeId) {
            case ScanFormula.NodeTypeId.NumericAdd: return this.encodeLeftRightArithmeticNumericNode(ZenithEncodedScanFormula.AddTupleNodeType, node as ScanFormula.LeftRightArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericDiv: return this.encodeLeftRightArithmeticNumericNode(ZenithEncodedScanFormula.DivTupleNodeType, node as ScanFormula.LeftRightArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericMod: return this.encodeLeftRightArithmeticNumericNode(ZenithEncodedScanFormula.ModTupleNodeType, node as ScanFormula.LeftRightArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericMul: return this.encodeLeftRightArithmeticNumericNode(ZenithEncodedScanFormula.MulTupleNodeType, node as ScanFormula.LeftRightArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericSub: return this.encodeLeftRightArithmeticNumericNode(ZenithEncodedScanFormula.SubTupleNodeType, node as ScanFormula.LeftRightArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericNeg: return this.encodeUnaryArithmeticNumericNode(ZenithEncodedScanFormula.NegTupleNodeType, node as ScanFormula.UnaryArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericPos: return this.encodeUnaryArithmeticNumericNode(ZenithEncodedScanFormula.PosTupleNodeType, node as ScanFormula.UnaryArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericAbs: return this.encodeUnaryArithmeticNumericNode(ZenithEncodedScanFormula.AbsTupleNodeType, node as ScanFormula.UnaryArithmeticNumericNode);
            case ScanFormula.NodeTypeId.NumericFieldValueGet: return this.encodeNumericFieldValueGetNode(node as ScanFormula.NumericFieldValueGetNode);
            case ScanFormula.NodeTypeId.NumericIf: return this.encodeNumericIfNode(node as ScanFormula.NumericIfNode);
            default:
                throw new UnreachableCaseError('ZSCCFNNPU', node.typeId);
        }
    }

    private encodeNumericComparisonNode(
        type:
            typeof ZenithEncodedScanFormula.EqualTupleNodeType |
            typeof ZenithEncodedScanFormula.GreaterThanTupleNodeType |
            typeof ZenithEncodedScanFormula.GreaterThanOrEqualTupleNodeType |
            typeof ZenithEncodedScanFormula.LessThanTupleNodeType |
            typeof ZenithEncodedScanFormula.LessThanOrEqualTupleNodeType,
        node: ScanFormula.NumericComparisonBooleanNode
    ): ZenithEncodedScanFormula.ComparisonTupleNode {
        const leftOperand = this.encodeNumericOperand(node.leftOperand);
        const rightOperand = this.encodeNumericOperand(node.rightOperand);
        return [type, leftOperand, rightOperand];
    }

    private encodeNumericOperand(operand: ScanFormula.NumericNode | number): ZenithEncodedScanFormula.NumericParam {
        if (operand instanceof ScanFormula.NumericNode) {
            return this.encodeNumericNode(operand)
        } else {
            return operand;
        }
    }

    private encodeUnaryArithmeticNumericNode(
        type:
            typeof ZenithEncodedScanFormula.NegTupleNodeType |
            typeof ZenithEncodedScanFormula.PosTupleNodeType |
            typeof ZenithEncodedScanFormula.AbsTupleNodeType,
        node: ScanFormula.UnaryArithmeticNumericNode
    ): ZenithEncodedScanFormula.UnaryExpressionTupleNode {
        const operand = node.operand;
        let param: ZenithEncodedScanFormula.NumericParam;
        if (operand instanceof ScanFormula.NumericNode) {
            param = this.encodeNumericNode(operand);
        } else {
            param = operand;
        }

        return [type, param];
    }

    private encodeLeftRightArithmeticNumericNode(
        type:
            typeof ZenithEncodedScanFormula.AddTupleNodeType |
            typeof ZenithEncodedScanFormula.DivTupleNodeType |
            typeof ZenithEncodedScanFormula.ModTupleNodeType |
            typeof ZenithEncodedScanFormula.MulTupleNodeType |
            typeof ZenithEncodedScanFormula.SubTupleNodeType,
        node: ScanFormula.LeftRightArithmeticNumericNode
    ): ZenithEncodedScanFormula.BinaryExpressionTupleNode {
        const leftOperand = node.leftOperand;
        let leftParam: ZenithEncodedScanFormula.NumericParam;
        if (leftOperand instanceof ScanFormula.NumericNode) {
            leftParam = this.encodeNumericNode(leftOperand);
        } else {
            leftParam = leftOperand;
        }

        const rightOperand = node.rightOperand;
        let rightParam: ZenithEncodedScanFormula.NumericParam;
        if (rightOperand instanceof ScanFormula.NumericNode) {
            rightParam = this.encodeNumericNode(rightOperand);
        } else {
            rightParam = rightOperand;
        }

        return [type, leftParam, rightParam];
    }

    private encodeNumericFieldValueGetNode(node: ScanFormula.NumericFieldValueGetNode): ZenithEncodedScanFormula.NumericRangeFieldTupleNodeType {
        return ScanFormulaZenithEncodingService.Field.numericRangeFromId(node.fieldId);
    }

    private encodeNumericIfNode(node: ScanFormula.NumericIfNode): ZenithEncodedScanFormula.NumericIfTupleNode {
        const tupleLength = 3 + node.trueArms.length * 2; // 1 (type) + 2 * trueArms + 2 (falseArm)
        const tupleNode = new Array<unknown>(tupleLength);
        tupleNode[0] = ZenithEncodedScanFormula.IfTupleNodeType;

        let index = 1;
        for (const arm of node.trueArms) {
            tupleNode[index++] = this.encodeBooleanNode(arm.condition);
            tupleNode[index++] = this.encodeNumericOperand(arm.value);
        }

        tupleNode[index++] = this.encodeBooleanNode(node.falseArm.condition);
        tupleNode[index] = this.encodeNumericOperand(node.falseArm.value);

        return tupleNode as ZenithEncodedScanFormula.NumericIfTupleNode;
    }

    private encodeIsNode(node: ScanFormula.IsNode): ZenithEncodedScanFormula.BooleanSingleMatchingTupleNode {
        const tupleNodeType = ScanFormulaZenithEncodingService.Is.Category.idToTupleNodeType(node.categoryId);
        return [tupleNodeType, node.trueFalse]
    }

    // private encodeBooleanFieldEqualsNode(node: ScanFormula.BooleanFieldEqualsNode): ZenithEncodedScanFormula.BooleanSingleMatchingTupleNode {
    //     const field = ScanFormulaZenithEncoding.Field.booleanFromId(node.fieldId);
    //     const target = node.target;
    //     return [field, target];
    // }

    private encodeFieldHasValueNode(node: ScanFormula.FieldHasValueNode):
            ZenithEncodedScanFormula.NumericRangeMatchingTupleNode |
            ZenithEncodedScanFormula.DateRangeMatchingTupleNode |
            ZenithEncodedScanFormula.TextMatchingTupleNode |
            ZenithEncodedScanFormula.MultipleMatchingTupleNode {

        const fieldId = node.fieldId;
        const fieldDataTypeId = ScanFormula.Field.idToDataTypeId(fieldId);
        switch (fieldDataTypeId) {
            case ScanFormula.Field.DataTypeId.Numeric: return [ScanFormulaZenithEncodingService.Field.numericRangeFromId(fieldId as ScanFormula.NumericRangeFieldId)];
            case ScanFormula.Field.DataTypeId.Text: return [ScanFormulaZenithEncodingService.Field.textTextFromId(fieldId as ScanFormula.TextContainsFieldId)];
            case ScanFormula.Field.DataTypeId.Date: return [ScanFormulaZenithEncodingService.Field.dateRangeFromId(fieldId as ScanFormula.DateRangeFieldId)];
            case ScanFormula.Field.DataTypeId.Boolean: throw new AssertInternalError('ZSCCFFHVNB50916', `${fieldId}`); // No boolean field supports HasValue
            default:
                throw new UnreachableCaseError('ZSCCFFHVND50916', fieldDataTypeId);
        }
    }

    private encodeNumericFieldEqualsNode(node: ScanFormula.NumericFieldEqualsNode): ZenithEncodedScanFormula.NumericRangeMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.numericRangeFromId(node.fieldId);
        const target = node.value;
        return [field, target];
    }

    private encodeNumericFieldInRangeNode(node: ScanFormula.NumericFieldInRangeNode): ZenithEncodedScanFormula.NumericRangeMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.numericRangeFromId(node.fieldId);
        const namedParameters: ZenithEncodedScanFormula.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, namedParameters];
    }

    private encodeDateFieldEqualsNode(node: ScanFormula.DateFieldEqualsNode): ZenithEncodedScanFormula.DateRangeMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.dateRangeFromId(node.fieldId);
        const target = ScanFormulaZenithEncodingService.DateValue.encodeDate(node.value);
        return [field, target];
    }

    private encodeDateFieldInRangeNode(node: ScanFormula.DateFieldInRangeNode): ZenithEncodedScanFormula.DateRangeMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.dateRangeFromId(node.fieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithEncodedScanFormula.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: ScanFormulaZenithEncodingService.DateValue.encodeDate(nodeMin),
            Max: nodeMax === undefined ? undefined: ScanFormulaZenithEncodingService.DateValue.encodeDate(nodeMax),
        }
        return [field, namedParameters];
    }

    private encodeStringFieldOverlapsNode(node: ScanFormula.StringFieldOverlapsNode): ZenithEncodedScanFormula.MultipleMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.textOverlapFromId(node.fieldId);
        const values = node.values;
        return [field, ...values];
    }

    private encodeCurrencyFieldOverlapsNode(node: ScanFormula.CurrencyFieldOverlapsNode): ZenithEncodedScanFormula.MultipleMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.textOverlapFromId(node.fieldId);
        const ids = node.values;
        const count = ids.length;
        const values = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const id = ids[i];
            const value = ZenithConvert.Currency.fromId(id);
            values[i] = value;
        }
        return [field, ...values];
    }

    private encodeExchangeFieldOverlapsNode(node: ScanFormula.ExchangeFieldOverlapsNode): ZenithEncodedScanFormula.MultipleMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.textOverlapFromId(node.fieldId);
        const exchanges = node.values;
        const count = exchanges.length;
        const values = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const exchange = exchanges[i];
            const value = exchange.zenithCode;
            values[i] = value;
        }
        return [field, ...values];
    }

    private encodeMarketFieldOverlapsNode(node: ScanFormula.MarketFieldOverlapsNode): ZenithEncodedScanFormula.MultipleMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.textOverlapFromId(node.fieldId);
        const markets = node.values;
        const count = markets.length;
        const values = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const market = markets[i];
            const value = market.zenithCode;
            values[i] = value;
        }
        return [field, ...values];
    }

    private encodeMarketBoardFieldOverlapsNode(node: ScanFormula.MarketBoardFieldOverlapsNode): ZenithEncodedScanFormula.MultipleMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.textOverlapFromId(node.fieldId);
        const marketBoards = node.values;
        const count = marketBoards.length;
        const values = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const marketBoard = marketBoards[i];
            const value = marketBoard.zenithCode;
            values[i] = value;
        }
        return [field, ...values];
    }

    private encodeTextFieldEqualsNode(node: ScanFormula.TextFieldEqualsNode): ZenithEncodedScanFormula.TextSingleMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.textSingleFromId(node.fieldId);
        const value = node.value;
        return [field, value];
    }

    private encodeTextFieldContainsNode(node: ScanFormula.TextFieldContainsNode): ZenithEncodedScanFormula.TextMatchingTupleNode {
        const field = ScanFormulaZenithEncodingService.Field.textTextFromId(node.fieldId);
        const value = node.value;
        const as = ScanFormulaZenithEncodingService.TextContainsAs.encodeId(node.asId);
        const namedParameters: ZenithEncodedScanFormula.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, value, namedParameters];
    }

    private encodePriceSubFieldHasValueNode(node: ScanFormula.PriceSubFieldHasValueNode): ZenithEncodedScanFormula.NumericNamedRangeMatchingTupleNode {
        return this.encodePriceSubFieldHasValue(node.subFieldId);
    }

    private encodePriceSubFieldHasValue(subFieldId: ScanFormula.PriceSubFieldId): ZenithEncodedScanFormula.NumericNamedRangeMatchingTupleNode {
        const field = ZenithEncodedScanFormula.PriceTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.PriceSubField.encodeId(subFieldId);
        return [field, subField];
    }

    private encodePriceSubFieldEqualsNode(node: ScanFormula.PriceSubFieldEqualsNode): ZenithEncodedScanFormula.NumericNamedRangeMatchingTupleNode {
        const field = ZenithEncodedScanFormula.PriceTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.PriceSubField.encodeId(node.subFieldId);
        const target = node.value;
        return [field, subField, target];
    }

    private encodePriceSubFieldInRangeNode(node: ScanFormula.PriceSubFieldInRangeNode): ZenithEncodedScanFormula.NumericNamedRangeMatchingTupleNode {
        const field = ZenithEncodedScanFormula.PriceTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.PriceSubField.encodeId(node.subFieldId);
        const namedParameters: ZenithEncodedScanFormula.NumericNamedParameters = {
            Min: node.min,
            Max: node.max,
        }
        return [field, subField, namedParameters];
    }

    private encodeDateSubFieldHasValueNode(node: ScanFormula.DateSubFieldHasValueNode): ZenithEncodedScanFormula.DateNamedRangeMatchingTupleNode {
        return this.encodeDateSubFieldHasValue(node.subFieldId);
    }

    private encodeDateSubFieldHasValue(subFieldId: ScanFormula.DateSubFieldId): ZenithEncodedScanFormula.DateNamedRangeMatchingTupleNode {
        const field = ZenithEncodedScanFormula.DateTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.DateSubField.encodeId(subFieldId);
        return [field, subField];
    }

    private encodeDateSubFieldEqualsNode(node: ScanFormula.DateSubFieldEqualsNode): ZenithEncodedScanFormula.DateNamedRangeMatchingTupleNode {
        const field = ZenithEncodedScanFormula.DateTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.DateSubField.encodeId(node.subFieldId);
        const target = ScanFormulaZenithEncodingService.DateValue.encodeDate(node.value);
        return [field, subField, target];
    }

    private encodeDateSubFieldInRangeNode(node: ScanFormula.DateSubFieldInRangeNode): ZenithEncodedScanFormula.DateNamedRangeMatchingTupleNode {
        const field = ZenithEncodedScanFormula.DateTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.DateSubField.encodeId(node.subFieldId);
        const nodeMin = node.min;
        const nodeMax = node.max;
        const namedParameters: ZenithEncodedScanFormula.DateNamedParameters = {
            Min: nodeMin === undefined ? undefined: ScanFormulaZenithEncodingService.DateValue.encodeDate(nodeMin),
            Max: nodeMax === undefined ? undefined: ScanFormulaZenithEncodingService.DateValue.encodeDate(nodeMax),
        }
        return [field, subField, namedParameters];
    }

    private encodeAltCodeSubFieldHasValueNode(node: ScanFormula.AltCodeSubFieldHasValueNode): ZenithEncodedScanFormula.NamedTextMatchingTupleNode {
        return this.encodeAltCodeSubFieldHasValue(node.subFieldId);
    }

    private encodeAltCodeSubFieldHasValue(subFieldId: ScanFormula.AltCodeSubFieldId): ZenithEncodedScanFormula.NamedTextMatchingTupleNode {
        const field = ZenithEncodedScanFormula.AltCodeTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.AltCodeSubField.encodeId(subFieldId);
        return [field, subField];
    }

    private encodeAltCodeSubFieldContainsNode(node: ScanFormula.AltCodeSubFieldContainsNode): ZenithEncodedScanFormula.NamedTextMatchingTupleNode {
        const field = ZenithEncodedScanFormula.AltCodeTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.AltCodeSubField.encodeId(node.subFieldId);
        const value = node.value;
        const as = ScanFormulaZenithEncodingService.TextContainsAs.encodeId(node.asId);
        const namedParameters: ZenithEncodedScanFormula.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, value, namedParameters];
    }

    private encodeAttributeSubFieldHasValueNode(node: ScanFormula.AttributeSubFieldHasValueNode): ZenithEncodedScanFormula.NamedTextMatchingTupleNode {
        return this.encodeAttributeSubFieldHasValue(node.subFieldId);
    }

    private encodeAttributeSubFieldHasValue(subFieldId: ScanFormula.AttributeSubFieldId): ZenithEncodedScanFormula.NamedTextMatchingTupleNode {
        const field = ZenithEncodedScanFormula.AttributeTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.AttributeSubField.encodeId(subFieldId);
        return [field, subField];
    }

    private encodeAttributeSubFieldContainsNode(node: ScanFormula.AttributeSubFieldContainsNode): ZenithEncodedScanFormula.NamedTextMatchingTupleNode {
        const field = ZenithEncodedScanFormula.AttributeTupleNodeType;
        const subField = ScanFormulaZenithEncodingService.AttributeSubField.encodeId(node.subFieldId);
        const value = node.value;
        const as = ScanFormulaZenithEncodingService.TextContainsAs.encodeId(node.asId);
        const namedParameters: ZenithEncodedScanFormula.TextNamedParameters = {
            As: as,
            IgnoreCase: node.ignoreCase,
        }
        return [field, subField, value, namedParameters];
    }

    private tryDecodeExpectedBooleanNode(node: ZenithEncodedScanFormula.BooleanTupleNode, strict: boolean, toProgress: ScanFormulaZenithEncodingService.DecodeProgress): Result<ScanFormula.BooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        toProgress.enterTupleNode();
        if (!Array.isArray(node)) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.BooleanTupleNodeIsNotAnArray, undefined);
        } else {
            if (node.length === 0) {
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.BooleanTupleNodeArrayIsZeroLength, undefined);
            } else {
                const nodeType = node[0];
                if (typeof nodeType !== 'string') {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.BooleanTupleNodeTypeIsNotString, `${nodeType}`);
                } else {
                    const decodedNode = toProgress.addDecodedNode(nodeType);

                    const result = this.tryDecodeBooleanNode(node, strict, toProgress)

                    if (result.isOk()) {
                        toProgress.exitTupleNode(decodedNode, result.value.typeId);
                    }

                    return result;
                }
            }
        }
    }

    private tryDecodeBooleanNode(tupleNode: ZenithEncodedScanFormula.BooleanTupleNode, strict: boolean, toProgress: ScanFormulaZenithEncodingService.DecodeProgress): Result<ScanFormula.BooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const nodeType = tupleNode[0] as ZenithEncodedScanFormula.BooleanTupleNodeType;

        switch (nodeType) {
            // Logical
            case ZenithEncodedScanFormula.NotTupleNodeType: return this.tryDecodeSingleOperandLogicalBooleanNode(tupleNode as ZenithEncodedScanFormula.LogicalTupleNode, ScanFormula.NotNode, strict, toProgress);
            case ZenithEncodedScanFormula.XorTupleNodeType: return this.tryDecodeLeftRightOperandLogicalBooleanNode(tupleNode as ZenithEncodedScanFormula.LogicalTupleNode, ScanFormula.XorNode, strict, toProgress);
            case ZenithEncodedScanFormula.AndTupleNodeType: return this.tryDecodeMultiOperandLogicalBooleanNode(tupleNode as ZenithEncodedScanFormula.LogicalTupleNode, ScanFormula.AndNode, strict, toProgress);
            case ZenithEncodedScanFormula.OrTupleNodeType: return this.tryDecodeMultiOperandLogicalBooleanNode(tupleNode as ZenithEncodedScanFormula.LogicalTupleNode, ScanFormula.OrNode, strict, toProgress);

            // Comparison
            case ZenithEncodedScanFormula.EqualTupleNodeType: return this.tryDecodeNumericComparisonNode(tupleNode as ZenithEncodedScanFormula.ComparisonTupleNode, ScanFormula.NumericEqualsNode, strict, toProgress);
            case ZenithEncodedScanFormula.GreaterThanTupleNodeType: return this.tryDecodeNumericComparisonNode(tupleNode as ZenithEncodedScanFormula.ComparisonTupleNode, ScanFormula.NumericGreaterThanNode, strict, toProgress);
            case ZenithEncodedScanFormula.GreaterThanOrEqualTupleNodeType: return this.tryDecodeNumericComparisonNode(tupleNode as ZenithEncodedScanFormula.ComparisonTupleNode, ScanFormula.NumericGreaterThanOrEqualNode, strict, toProgress);
            case ZenithEncodedScanFormula.LessThanTupleNodeType: return this.tryDecodeNumericComparisonNode(tupleNode as ZenithEncodedScanFormula.ComparisonTupleNode, ScanFormula.NumericLessThanNode, strict, toProgress);
            case ZenithEncodedScanFormula.LessThanOrEqualTupleNodeType: return this.tryDecodeNumericComparisonNode(tupleNode as ZenithEncodedScanFormula.ComparisonTupleNode, ScanFormula.NumericLessThanOrEqualNode, strict, toProgress);
            case ZenithEncodedScanFormula.AllTupleNodeType: return new Ok(new ScanFormula.AllNode());
            case ZenithEncodedScanFormula.NoneTupleNodeType: return new Ok(new ScanFormula.NoneNode());

            // Matching
            case ZenithEncodedScanFormula.AltCodeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.AltCodeSubbed, strict);
            case ZenithEncodedScanFormula.AttributeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.AttributeSubbed, strict);
            case ZenithEncodedScanFormula.AuctionTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Auction, strict);
            case ZenithEncodedScanFormula.AuctionLastTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.AuctionLast, strict);
            case ZenithEncodedScanFormula.AuctionQuantityTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.AuctionQuantity, strict);
            case ZenithEncodedScanFormula.BestAskCountTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.BestAskCount, strict);
            case ZenithEncodedScanFormula.BestAskPriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.BestAskPrice, strict);
            case ZenithEncodedScanFormula.BestAskQuantityTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.BestAskQuantity, strict);
            case ZenithEncodedScanFormula.BestBidCountTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.BestBidCount, strict);
            case ZenithEncodedScanFormula.BestBidPriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.BestBidPrice, strict);
            case ZenithEncodedScanFormula.BestBidQuantityTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.BestBidQuantity, strict);
            case ZenithEncodedScanFormula.BoardTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.MarketBoard, strict);
            case ZenithEncodedScanFormula.CallOrPutTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.CallOrPut, strict);
            case ZenithEncodedScanFormula.CategoryTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Category, strict);
            case ZenithEncodedScanFormula.CfiTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Cfi, strict);
            case ZenithEncodedScanFormula.ClassTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Class, strict);
            case ZenithEncodedScanFormula.ClosePriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.ClosePrice, strict);
            case ZenithEncodedScanFormula.CodeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Code, strict);
            case ZenithEncodedScanFormula.ContractSizeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.ContractSize, strict);
            case ZenithEncodedScanFormula.CurrencyTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Currency, strict);
            case ZenithEncodedScanFormula.DataTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Data, strict);
            case ZenithEncodedScanFormula.DateTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.DateSubbed, strict);
            case ZenithEncodedScanFormula.ExerciseTypeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.ExerciseType, strict);
            case ZenithEncodedScanFormula.ExchangeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Exchange, strict);
            case ZenithEncodedScanFormula.ExpiryDateTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.ExpiryDate, strict);
            case ZenithEncodedScanFormula.HighPriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.HighPrice, strict);
            case ZenithEncodedScanFormula.IsIndexTupleNodeType: return this.tryDecodeIsBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.IsNode.CategoryId.Index);
            case ZenithEncodedScanFormula.LegTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Leg, strict);
            case ZenithEncodedScanFormula.LastPriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.LastPrice, strict);
            case ZenithEncodedScanFormula.LotSizeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.LotSize, strict);
            case ZenithEncodedScanFormula.LowPriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.LowPrice, strict);
            case ZenithEncodedScanFormula.MarketTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Market, strict);
            case ZenithEncodedScanFormula.NameTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Name, strict);
            case ZenithEncodedScanFormula.OpenInterestTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.OpenInterest, strict);
            case ZenithEncodedScanFormula.OpenPriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.OpenPrice, strict);
            case ZenithEncodedScanFormula.PriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.PriceSubbed, strict);
            case ZenithEncodedScanFormula.PreviousCloseTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.PreviousClose, strict);
            case ZenithEncodedScanFormula.QuotationBasisTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.QuotationBasis, strict);
            case ZenithEncodedScanFormula.RemainderTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Remainder, strict);
            case ZenithEncodedScanFormula.ShareIssueTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.ShareIssue, strict);
            case ZenithEncodedScanFormula.StateTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.TradingStateName, strict);
            case ZenithEncodedScanFormula.StateAllowsTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.TradingStateAllows, strict);
            case ZenithEncodedScanFormula.StatusNoteTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.StatusNote, strict);
            case ZenithEncodedScanFormula.StrikePriceTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.StrikePrice, strict);
            case ZenithEncodedScanFormula.TradesTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Trades, strict);
            case ZenithEncodedScanFormula.TradingMarketTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.TradingMarket, strict);
            case ZenithEncodedScanFormula.ValueTradedTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.ValueTraded, strict);
            case ZenithEncodedScanFormula.VolumeTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Volume, strict);
            case ZenithEncodedScanFormula.VwapTupleNodeType: return this.tryDecodeFieldBooleanNode(tupleNode as ZenithEncodedScanFormula.MatchingTupleNode, ScanFormula.FieldId.Vwap, strict);

            default: {
                const neverTupleNodeType: never = nodeType;
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownBooleanTupleNodeType, neverTupleNodeType as string);
            }
        }
    }

    private tryDecodeSingleOperandLogicalBooleanNode(
        tulipNode: ZenithEncodedScanFormula.LogicalTupleNode,
        nodeConstructor: new() => ScanFormula.SingleOperandBooleanNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress,
    ): Result<ScanFormula.SingleOperandBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (tulipNode.length !== 2) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SingleOperandLogicalBooleanDoesNotHaveOneOperand, tulipNode[0]);
        } else {
            const tupleNodeResult = this.tryDecodeExpectedBooleanOperand(tulipNode[1], strict, toProgress);
            if (tupleNodeResult.isErr()) {
                return tupleNodeResult.createType();
            } else {
                const resultNode = new nodeConstructor();
                resultNode.operand = tupleNodeResult.value;
                return new Ok(resultNode);
            }
        }
    }

    private tryDecodeLeftRightOperandLogicalBooleanNode(
        tulipNode: ZenithEncodedScanFormula.LogicalTupleNode,
        nodeConstructor: new() => ScanFormula.LeftRightOperandBooleanNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress,
    ): Result<ScanFormula.LeftRightOperandBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const tulipNodeLength = tulipNode.length;
        if (tulipNodeLength !== 3) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands, tulipNode[0]);
        } else {
            const leftOperandResult = this.tryDecodeExpectedBooleanOperand(tulipNode[1], strict, toProgress);
            if (leftOperandResult.isErr()) {
                return leftOperandResult.createType();
            } else {
                const leftOperand = leftOperandResult.value;
                const rightOperandResult = this.tryDecodeExpectedBooleanOperand(tulipNode[2], strict, toProgress);
                if (rightOperandResult.isErr()) {
                    return rightOperandResult.createType();
                } else {
                    const rightOperand = rightOperandResult.value;
                    const resultNode = new nodeConstructor();
                    resultNode.leftOperand = leftOperand;
                    resultNode.rightOperand = rightOperand;
                    return new Ok(resultNode);
                }
            }
        }
    }

    private tryDecodeMultiOperandLogicalBooleanNode(
        tulipNode: ZenithEncodedScanFormula.LogicalTupleNode,
        nodeConstructor: new() => ScanFormula.MultiOperandBooleanNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress,
    ): Result<ScanFormula.MultiOperandBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const tulipNodeLength = tulipNode.length;
        if (tulipNodeLength < 2) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.MultiOperandLogicalBooleanMissingOperands, tulipNode[0]);
        } else {
            const operands = new Array<ScanFormula.BooleanNode>(tulipNodeLength - 1);
            for (let i = 1; i < tulipNodeLength; i++) {
                const tulipParam = tulipNode[i] as ZenithEncodedScanFormula.BooleanParam; // Need to cast as (skipped) first element in array is LogicalTupleNodeType
                const operandResult = this.tryDecodeExpectedBooleanOperand(tulipParam, strict, toProgress);
                if (operandResult.isErr()) {
                    return operandResult.createType();
                } else {
                    operands[i - 1] = operandResult.value;
                }
            }

            const resultNode = new nodeConstructor();
            resultNode.operands = operands;
            return new Ok(resultNode);
        }
    }

    private tryDecodeExpectedBooleanOperand(
        param: ZenithEncodedScanFormula.BooleanParam,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.BooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (Array.isArray(param)) {
            return this.tryDecodeExpectedBooleanNode(param, strict, toProgress);
        } else {
            if (typeof param !== 'string') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnexpectedBooleanParamType, `${param}`);
            } else {
                const fieldId = ScanFormulaZenithEncodingService.Field.tryToId(param as ZenithEncodedScanFormula.FieldTupleNodeType);
                if (fieldId !== undefined) {
                    if (ScanFormula.Field.idIsSubbed(fieldId)) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.FieldBooleanParamCannotBeSubbedField, param);
                    } else {
                        const styleId = ScanFormula.Field.idToStyleId(fieldId);
                        switch (styleId) {
                            case ScanFormula.Field.StyleId.InRange: return new Ok(this.createFieldHasValueNode(fieldId as ScanFormula.NumericRangeFieldId));
                            case ScanFormula.Field.StyleId.HasValueEquals: return new Ok(this.createFieldHasValueNode(fieldId as ScanFormula.TextHasValueEqualsFieldId));
                            case ScanFormula.Field.StyleId.Overlaps:
                            case ScanFormula.Field.StyleId.Equals:
                            case ScanFormula.Field.StyleId.Contains:
                                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.FieldBooleanParamMustBeRangeOrExistsSingle, param);
                            default:
                                throw new UnreachableCaseError('SFZETDEBOSU44498', styleId);
                        }
                    }
                } else {
                    const categoryId = ScanFormulaZenithEncodingService.Is.Category.tryTupleNodeTypeToId(param as ZenithEncodedScanFormula.BooleanSingleFieldTupleNodeType);
                    if (categoryId !== undefined) {
                        return new Ok(this.createIsNode(categoryId, undefined));
                    } else {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownFieldBooleanParam, param);
                    }
                }
            }
        }
    }

    // private tryDecodeFieldBooleanNode(value: ZenithScanCriteria.MatchingField): Result<ScanCriteria.FieldBooleanNode, ZenithScanCriteriaParseError> {
    //     switch (value) {

    //     }
    // }

    private tryDecodeIsBooleanNode(
        node: ZenithEncodedScanFormula.MatchingTupleNode,
        categoryId: ScanFormula.IsNode.CategoryId,
    ): Result<ScanFormula.IsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const paramCount = node.length - 1;
        switch (paramCount) {
            case 0: {
                return new Ok(this.createIsNode(categoryId, undefined));
            }
            case 1: {
                const param = node[1];
                if (typeof param === 'boolean') {
                    return new Ok(this.createIsNode(categoryId, param));
                } else {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.IsBooleanTupleNodeParameterIsNotBoolean, typeof param);
                }
            }
            default:
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.IsBooleanTupleNodeHasTooManyParameters, paramCount.toString());
            }
    }

    private tryDecodeFieldBooleanNode(
        node: ZenithEncodedScanFormula.MatchingTupleNode,
        fieldId: ScanFormula.FieldId,
        strict: boolean,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const styleId = ScanFormula.Field.idToStyleId(fieldId);

        switch (styleId) {
            case ScanFormula.Field.StyleId.InRange: {
                return this.tryDecodeRangeMatchingTupleNode(node as ZenithEncodedScanFormula.RangeMatchingTupleNode, fieldId);
            }
            case ScanFormula.Field.StyleId.Overlaps: {
                return this.tryDecodeMultipleMatchingTupleNode(node as ZenithEncodedScanFormula.MultipleMatchingTupleNode, fieldId, strict);
            }
            case ScanFormula.Field.StyleId.Equals: {
                return this.tryDecodeEqualsSingleMatchingTupleNode(node, fieldId);
            }
            case ScanFormula.Field.StyleId.HasValueEquals: {
                return this.tryDecodeExistsSingleMatchingTupleNode(node, fieldId);
            }
            case ScanFormula.Field.StyleId.Contains: {
                return this.tryDecodeTextMatchingTupleNode(node as ZenithEncodedScanFormula.TextMatchingTupleNode, fieldId);
            }
            default:
                throw new UnreachableCaseError('SFZETDFBN40971', styleId);
        }
    }

    private tryDecodeRangeMatchingTupleNode(
        node: ZenithEncodedScanFormula.RangeMatchingTupleNode,
        fieldId: ScanFormula.FieldId,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subbed = ScanFormula.Field.idIsSubbed(fieldId);
        const nodeCount = node.length;

        let paramCount: Integer;
        let firstParamIndex: Integer;
        if (!subbed) {
            paramCount = nodeCount - 1;
            firstParamIndex = 1;
        } else {
            paramCount = nodeCount - 2;
            firstParamIndex = 2;
            if (paramCount < 0) {
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeSubFieldIsMissing, paramCount.toString());
            }
        }

        switch (paramCount) {
            case 0: {
                if (subbed) {
                    return this.tryDecodeSubbedFieldHasValueNode(fieldId, node[1]);
                } else {
                    return new Ok(this.createFieldHasValueNode(fieldId as ScanFormula.NumericRangeFieldId));
                }
            }
            case 1: {
                const param1 = node[firstParamIndex];
                const dataTypeId = ScanFormula.Field.idToDataTypeId(fieldId);
                switch (dataTypeId) {
                    case ScanFormula.Field.DataTypeId.Numeric: {
                        const param1Type = typeof param1;
                        switch (param1Type) {
                            case 'number': {
                                if (!subbed) {
                                    return this.tryDecodeNumericFieldEqualsNode(fieldId as ScanFormula.NumericRangeFieldId, param1);
                                } else {
                                    return this.tryDecodeNumericRangeSubbedFieldEqualsNode(fieldId as ScanFormula.NumericRangeSubbedFieldId, node[1], param1);
                                }
                            }
                            case 'object': {
                                if (param1 === null) {
                                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NamedParametersCannotBeNull, '');
                                } else {
                                    const { At: at, Min: min, Max: max } = param1 as ZenithEncodedScanFormula.NumericNamedParameters
                                    if (at !== undefined) {
                                        if (!subbed) {
                                            return this.tryDecodeNumericFieldEqualsNode(fieldId as ScanFormula.NumericRangeFieldId, at);
                                        } else {
                                            return this.tryDecodeNumericRangeSubbedFieldEqualsNode(fieldId as ScanFormula.NumericRangeSubbedFieldId, node[1], at);
                                        }
                                    } else {
                                        if (!subbed) {
                                            return this.tryDecodeNumericFieldInRangeNode(fieldId as ScanFormula.NumericRangeFieldId, min, max);
                                        } else {
                                            return this.tryDecodeNumericSubbedFieldInRangeNode(fieldId as ScanFormula.NumericRangeSubbedFieldId, node[1], min, max);
                                        }
                                    }
                                }
                            }
                            default:
                                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NumericRangeFirstParameterMustBeNumberOrNamed, param1Type);
                        }
                    }
                    case ScanFormula.Field.DataTypeId.Date: {
                        const param1Type = typeof param1;
                        switch (param1Type) {
                            case 'string': {
                                if (!subbed) {
                                    return this.tryDecodeDateFieldEqualsNode(fieldId as ScanFormula.DateRangeFieldId, param1);
                                } else {
                                    return this.tryDecodeDateRangeSubbedFieldEqualsNode(fieldId as ScanFormula.DateRangeSubbedFieldId, node[1], param1);
                                }
                            }
                            case 'object': {
                                if (param1 === null) {
                                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NamedParametersCannotBeNull, '');
                                } else {
                                    const { At: at, Min: min, Max: max } = param1 as ZenithEncodedScanFormula.NumericNamedParameters
                                    if (at !== undefined) {
                                        if (!subbed) {
                                            return this.tryDecodeDateFieldEqualsNode(fieldId as ScanFormula.DateRangeFieldId, at);
                                        } else {
                                            return this.tryDecodeDateRangeSubbedFieldEqualsNode(fieldId as ScanFormula.DateRangeSubbedFieldId, node[1], at);
                                        }
                                    } else {
                                        if (!subbed) {
                                            return this.tryDecodeDateFieldInRangeNode(fieldId as ScanFormula.DateRangeFieldId, min, max);
                                        } else {
                                            return this.tryDecodeDateSubbedFieldInRangeNode(fieldId as ScanFormula.DateRangeSubbedFieldId, node[1], min, max);
                                        }
                                    }
                                }
                            }
                            default:
                                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.DateRangeFirstParameterMustBeStringOrNamed, param1Type);
                        }
                    }
                    case ScanFormula.Field.DataTypeId.Text:
                    case ScanFormula.Field.DataTypeId.Boolean:
                        throw new AssertInternalError('SFZETDRMTN1U55098', dataTypeId.toString());
                    default:
                        throw new UnreachableCaseError('SFZETDRMTN1D55098', dataTypeId);
                }
            }
            case 2: {
                const param1 = node[firstParamIndex];
                const param2 = node[firstParamIndex + 1];
                const dataTypeId = ScanFormula.Field.idToDataTypeId(fieldId);
                switch (dataTypeId) {
                    case ScanFormula.Field.DataTypeId.Numeric: {
                        if (!subbed) {
                            return this.tryDecodeNumericFieldInRangeNode(fieldId as ScanFormula.NumericRangeFieldId, param1, param2);
                        } else {
                            return this.tryDecodeNumericSubbedFieldInRangeNode(fieldId as ScanFormula.NumericRangeSubbedFieldId, node[1], param1, param2);
                        }
                    }
                    case ScanFormula.Field.DataTypeId.Date:
                        if (!subbed) {
                            return this.tryDecodeDateFieldInRangeNode(fieldId as ScanFormula.DateRangeFieldId, param1, param2);
                        } else {
                            return this.tryDecodeDateSubbedFieldInRangeNode(fieldId as ScanFormula.DateRangeSubbedFieldId, node[1], param1, param2);
                        }
                    case ScanFormula.Field.DataTypeId.Text:
                    case ScanFormula.Field.DataTypeId.Boolean:
                        throw new AssertInternalError('SFZETDRMTN2U55098', dataTypeId.toString());
                    default:
                        throw new UnreachableCaseError('SFZETDRMTN2D55098', dataTypeId);
                }
            }
            default:
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeFieldBooleanTupleNodeHasTooManyParameters, paramCount.toString());
        }
    }

    private tryDecodeTextMatchingTupleNode(
        node: ZenithEncodedScanFormula.MatchingTupleNode,
        fieldId: ScanFormula.FieldId,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subbed = ScanFormula.Field.idIsSubbed(fieldId);
        const nodeCount = node.length;

        let paramCount: Integer;
        let firstParamIndex: Integer;
        if (!subbed) {
            paramCount = nodeCount - 1;
            firstParamIndex = 1;
        } else {
            paramCount = nodeCount - 2;
            firstParamIndex = 2;
            if (paramCount < 0) {
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TextSubFieldIsMissing, paramCount.toString());
            }
        }

        const dataTypeId = ScanFormula.Field.idToDataTypeId(fieldId);
        if (dataTypeId !== ScanFormula.Field.DataTypeId.Text) {
            throw new AssertInternalError('SFZETDTMTN1U55098', dataTypeId.toString());
        } else {
            switch (paramCount) {
                case 0: {
                    if (subbed) {
                        return this.tryDecodeSubbedFieldHasValueNode(fieldId, node[1]);
                    } else {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TextFieldMustHaveAtLeastOneParameter, '');
                    }
                }
                case 1: {
                    const param1 = node[firstParamIndex];
                    if (!subbed) {
                        return this.tryDecodeTextFieldContainsNode(fieldId as ScanFormula.TextContainsFieldId, param1, undefined, undefined);
                    } else {
                        return this.tryDecodeTextSubbedFieldContainsNode(fieldId as ScanFormula.TextContainsSubbedFieldId, node[1], param1, undefined, undefined);
                    }
                }
                case 2: {
                    const param1 = node[firstParamIndex];
                    const param2 = node[firstParamIndex + 1];
                    const param2Type = typeof param2;
                    switch (param2Type) {
                        case 'string': {
                            if (!subbed) {
                                return this.tryDecodeTextFieldContainsNode(fieldId as ScanFormula.TextContainsFieldId, param1, param2, undefined);
                            } else {
                                return this.tryDecodeTextSubbedFieldContainsNode(fieldId as ScanFormula.TextContainsSubbedFieldId, node[1], param1, param2, undefined);
                            }
                        }
                        case 'object': {
                            if (param2 === null) {
                                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NamedParametersCannotBeNull, '');
                            } else {
                                const { As: as, IgnoreCase: ignoreCase } = param2 as ZenithEncodedScanFormula.TextNamedParameters
                                if (!subbed) {
                                    return this.tryDecodeTextFieldContainsNode(fieldId as ScanFormula.TextContainsFieldId, param1, as, ignoreCase);
                                } else {
                                    return this.tryDecodeTextSubbedFieldContainsNode(fieldId as ScanFormula.TextContainsSubbedFieldId, node[1], param1, as, ignoreCase);
                                }
                            }
                        }
                        default:
                            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TextRangeSecondParameterMustBeStringOrNamed, param2Type);
                    }
                }
                case 3: {
                    const param1 = node[firstParamIndex];
                    const param2 = node[firstParamIndex + 1];
                    const param3 = node[firstParamIndex + 2];

                    if (!subbed) {
                        return this.tryDecodeTextFieldContainsNode(fieldId as ScanFormula.TextContainsFieldId, param1, param2, param3);
                    } else {
                        return this.tryDecodeTextSubbedFieldContainsNode(fieldId as ScanFormula.TextContainsSubbedFieldId, node[1], param1, param2, param3);
                    }
                }
                default:
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TextFieldBooleanTupleNodeHasTooManyParameters, paramCount.toString());
            }
        }
    }

    private tryDecodeEqualsSingleMatchingTupleNode(
        node: ZenithEncodedScanFormula.MatchingTupleNode,
        fieldId: ScanFormula.FieldId,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const paramCount = node.length - 1;
        if (paramCount !== 1) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SingleFieldMustHaveOneParameter, paramCount.toString());
        } else {
            const dataTypeId = ScanFormula.Field.idToDataTypeId(fieldId);
            if (dataTypeId !== ScanFormula.Field.DataTypeId.Text) {
                throw new AssertInternalError('SFZETDSMTN43087', dataTypeId.toString());
            } else {
                return this.tryDecodeTextEqualsSingleMatchingTupleNode(fieldId as ScanFormula.TextEqualsFieldId, node[1]);
            }
        }
    }

    private tryDecodeExistsSingleMatchingTupleNode(
        node: ZenithEncodedScanFormula.MatchingTupleNode,
        fieldId: ScanFormula.FieldId,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const paramCount = node.length - 1;
        switch (paramCount) {
            case 0: return new Ok(this.createFieldHasValueNode(fieldId as ScanFormula.TextHasValueEqualsFieldId));
            case 1: return this.tryDecodeEqualsSingleMatchingTupleNode(node, fieldId);
            default:
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.ExistsSingleFieldMustNotHaveMoreThan1Parameter, paramCount.toString());
        }
    }

    private tryDecodeTextEqualsSingleMatchingTupleNode(
        fieldId: ScanFormula.TextEqualsFieldId,
        param: unknown,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof param !== 'string') {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SingleFieldParameterIsNotString, typeof param);
        } else {
            const node = new ScanFormula.TextFieldEqualsNode();
            node.fieldId = fieldId;
            node.value = param;
            return new Ok(node);
        }
    }

    private tryDecodeMultipleMatchingTupleNode(
        node: ZenithEncodedScanFormula.MultipleMatchingTupleNode,
        fieldId: ScanFormula.FieldId,
        strict: boolean,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const dataTypeId = ScanFormula.Field.idToDataTypeId(fieldId);
        if (node.length <= 1) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.MultipleMatchingTupleNodeMissingParameters, node[0]);
        } else {
            if (dataTypeId !== ScanFormula.Field.DataTypeId.Text) {
                throw new AssertInternalError('SFZETDFBN20987', dataTypeId.toString());
            } else {
                const params: unknown[] = node.slice(1);
                return this.tryDecodeTextMultipleMatchingTupleNode(fieldId as ScanFormula.TextOverlapFieldId, params, strict);
            }
        }
    }

    private tryDecodeTextMultipleMatchingTupleNode(
        fieldId: ScanFormula.TextOverlapFieldId,
        params: unknown[],
        strict: boolean,
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const count = params.length;
        const values = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const param = params[i];
            if (typeof param !== 'string') {
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TextMultipleMatchingTupleNodeParameterIsNotString, i.toString());
            } else {
                values[i] = param;
            }
        }

        switch (fieldId) {
            case ScanFormula.FieldId.MarketBoard: return this.tryDecodeBoardMultipleMatchingTupleNode(fieldId, values, strict)
            case ScanFormula.FieldId.Category: return this.tryDecodeStringMultipleMatchingTupleNode(fieldId, values);
            case ScanFormula.FieldId.Currency: return this.tryDecodeCurrencyMultipleMatchingTupleNode(fieldId, values, strict);
            case ScanFormula.FieldId.Exchange: return this.tryDecodeExchangeMultipleMatchingTupleNode(fieldId, values, strict);
            case ScanFormula.FieldId.Market: return this.tryDecodeMarketMultipleMatchingTupleNode(fieldId, values, strict);
            case ScanFormula.FieldId.QuotationBasis: return this.tryDecodeStringMultipleMatchingTupleNode(fieldId, values);
            case ScanFormula.FieldId.TradingStateName: return this.tryDecodeStringMultipleMatchingTupleNode(fieldId, values);
            case ScanFormula.FieldId.StatusNote: return this.tryDecodeStringMultipleMatchingTupleNode(fieldId, values);
            case ScanFormula.FieldId.TradingMarket: return this.tryDecodeMarketMultipleMatchingTupleNode(fieldId, values, strict);
            default:
                throw new UnreachableCaseError('SFZETDTMMTN49843', fieldId);
        }
    }

    private tryDecodeBoardMultipleMatchingTupleNode(fieldId: ScanFormula.TextOverlapFieldId, stringValues: string[], strict: boolean): Result<ScanFormula.MarketBoardFieldOverlapsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const count = stringValues.length;
        const values = new Array<MarketBoard>(count);
        let valueCount = 0;
        for (let i = 0; i < count; i++) {
            const unenvironmentedZenithCode = stringValues[i];
            const board = this._marketsService.findDefaultEnvironmentMarketBoard(unenvironmentedZenithCode, undefined);
            if (board !== undefined) {
                values[valueCount++] = board;
            } else {
                if (strict) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownMarketBoard, unenvironmentedZenithCode);
                }
            }
        }
        values.length = valueCount;

        const node = new ScanFormula.MarketBoardFieldOverlapsNode();
        node.fieldId = fieldId;
        node.values = values;
        return new Ok(node);
    }

    private tryDecodeCurrencyMultipleMatchingTupleNode(fieldId: ScanFormula.TextOverlapFieldId, stringValues: string[], strict: boolean): Result<ScanFormula.CurrencyFieldOverlapsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const count = stringValues.length;
        const values = new Array<CurrencyId>(count);
        let valueCount = 0;
        for (let i = 0; i < count; i++) {
            const stringValue = stringValues[i];
            const currencyId = Currency.tryDisplayToId(stringValue);
            if (currencyId === undefined) {
                if (strict) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownCurrency, stringValue);
                }
            } else {
                values[valueCount++] = currencyId;
            }
        }
        values.length = valueCount;

        const node = new ScanFormula.CurrencyFieldOverlapsNode();
        node.fieldId = fieldId;
        node.values = values;
        return new Ok(node);
    }

    private tryDecodeExchangeMultipleMatchingTupleNode(fieldId: ScanFormula.TextOverlapFieldId, stringValues: string[], strict: boolean): Result<ScanFormula.ExchangeFieldOverlapsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const count = stringValues.length;
        const values = new Array<Exchange>(count);
        let valueCount = 0;
        for (let i = 0; i < count; i++) {
            const unenvironmentedZenithCode = stringValues[i];
            const exchange = this._marketsService.tryGetDefaultEnvironmentExchange(unenvironmentedZenithCode, false)
            if (exchange !== undefined) {
                values[valueCount++] = exchange;
            } else {
                if (strict) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownExchange, unenvironmentedZenithCode);
                }
            }
        }
        values.length = valueCount;

        const node = new ScanFormula.ExchangeFieldOverlapsNode();
        node.fieldId = fieldId;
        node.values = values;
        return new Ok(node);
    }

    private tryDecodeMarketMultipleMatchingTupleNode(fieldId: ScanFormula.TextOverlapFieldId, stringValues: string[], strict: boolean): Result<ScanFormula.MarketFieldOverlapsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const count = stringValues.length;
        const values = new Array<DataMarket>(count);
        let valueCount = 0;
        for (let i = 0; i < count; i++) {
            const unenvironmentedZenithCode = stringValues[i];
            const market = this._marketsService.tryGetDefaultEnvironmentDataMarket(unenvironmentedZenithCode, false)
            if (market !== undefined) {
                values[valueCount++] = market;
            } else {
                if (strict) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownMarket, unenvironmentedZenithCode);
                }
            }
        }
        values.length = valueCount;

        const node = new ScanFormula.MarketFieldOverlapsNode();
        node.fieldId = fieldId;
        node.values = values;
        return new Ok(node);
    }

    private tryDecodeStringMultipleMatchingTupleNode(fieldId: ScanFormula.TextOverlapFieldId, stringValues: string[]): Result<ScanFormula.StringFieldOverlapsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const node = new ScanFormula.StringFieldOverlapsNode();
        node.fieldId = fieldId;
        node.values = stringValues.slice();
        return new Ok(node);
    }

    private createIsNode(categoryId: ScanFormula.IsNode.CategoryId, trueFalse: boolean | undefined): ScanFormula.IsNode {
        const isNode = new ScanFormula.IsNode(categoryId);
        if (trueFalse !== undefined) {
            isNode.trueFalse = trueFalse;
        } else {
            isNode.trueFalse = ScanFormulaZenithEncodingService.Is.Category.idToDefaultTrueFalse(categoryId);
        }
        return isNode;
    }

    private createFieldHasValueNode(fieldId: ScanFormula.TextHasValueEqualsFieldId | ScanFormula.NumericRangeFieldId | ScanFormula.DateRangeFieldId): ScanFormula.FieldHasValueNode {
        const hasValueNode = new ScanFormula.FieldHasValueNode();
        hasValueNode.fieldId = fieldId;
        return hasValueNode;
    }

    private tryDecodeSubbedFieldHasValueNode(fieldId: ScanFormula.SubbedFieldId, subField: unknown):
            Result<
                ScanFormula.PriceSubFieldHasValueNode |
                ScanFormula.DateSubFieldHasValueNode |
                ScanFormula.AltCodeSubFieldHasValueNode |
                ScanFormula.AttributeSubFieldHasValueNode,
                ScanFormulaZenithEncodingService.DecodeError
            > {
        if (typeof subField !== 'string') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SubFieldIsNotString, `${subField}`);
        } else {
            switch (fieldId) {
                case ScanFormula.FieldId.PriceSubbed: {
                    const subFieldId = ScanFormulaZenithEncodingService.PriceSubField.tryDecodeId(subField as ZenithEncodedScanFormula.PriceSubFieldEnum);
                    if (subFieldId === undefined) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.PriceSubFieldHasValueSubFieldIsUnknown, subField);
                    } else {
                        const node = new ScanFormula.PriceSubFieldHasValueNode();
                        node.fieldId = fieldId;
                        node.subFieldId = subFieldId;
                        return new Ok(node);
                    }
                }
                case ScanFormula.FieldId.DateSubbed: {
                    const subFieldId = ScanFormulaZenithEncodingService.DateSubField.tryDecodeId(subField as ZenithEncodedScanFormula.DateSubFieldEnum);
                    if (subFieldId === undefined) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.DateSubFieldHasValueSubFieldIsUnknown, subField);
                    } else {
                        const node = new ScanFormula.DateSubFieldHasValueNode();
                        node.fieldId = fieldId;
                        node.subFieldId = subFieldId;
                        return new Ok(node);
                    }
                }
                case ScanFormula.FieldId.AltCodeSubbed: {
                    const subFieldId = ScanFormulaZenithEncodingService.AltCodeSubField.tryDecodeId(subField as ZenithEncodedScanFormula.AltCodeSubField);
                    if (subFieldId === undefined) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.AltCodeSubFieldHasValueSubFieldIsUnknown, subField);
                    } else {
                        const node = new ScanFormula.AltCodeSubFieldHasValueNode();
                        node.fieldId = fieldId;
                        node.subFieldId = subFieldId;
                        return new Ok(node);
                    }
                }
                case ScanFormula.FieldId.AttributeSubbed: {
                    const subFieldId = ScanFormulaZenithEncodingService.AttributeSubField.tryDecodeId(subField as ZenithEncodedScanFormula.AttributeSubField);
                    if (subFieldId === undefined) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.AttributeSubFieldHasValueSubFieldIsUnknown, subField);
                    } else {
                        const node = new ScanFormula.AttributeSubFieldHasValueNode();
                        node.fieldId = fieldId;
                        node.subFieldId = subFieldId;
                        return new Ok(node);
                    }
                }
                default:
                    throw new UnreachableCaseError('ZSCCTTSFHVN66674', fieldId);
            }
        }
    }

    private tryDecodeNumericFieldEqualsNode(fieldId: ScanFormula.NumericRangeFieldId, target: unknown): Result<ScanFormula.NumericFieldEqualsNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof target !== 'number') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TargetIsNotNumber, `${target}`);
        } else {
            const node = new ScanFormula.NumericFieldEqualsNode();
            node.fieldId = fieldId;
            node.value = target;
            return new Ok(node);
        }
    }

    private tryDecodeNumericFieldInRangeNode(fieldId: ScanFormula.NumericRangeFieldId, min: unknown, max: unknown): Result<ScanFormula.NumericFieldInRangeNode, ScanFormulaZenithEncodingService.DecodeError> {
        const minUndefined = min === undefined;
        if (!minUndefined && typeof min !== 'number') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinIsDefinedButNotNumber, `${min}`);
        } else {
            const maxUndefined = max === undefined;
            if (!maxUndefined && typeof max !== 'number') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMaxIsDefinedButNotNumber, `${max}`);
            } else {
                if (minUndefined && maxUndefined) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinAndMaxAreBothUndefined, undefined);
                } else {
                    const node = new ScanFormula.NumericFieldInRangeNode();
                    node.fieldId = fieldId;
                    node.min = min;
                    node.max = max;
                    return new Ok(node);
                }
            }
        }
    }

    private tryDecodeDateFieldEqualsNode(fieldId: ScanFormula.DateRangeFieldId, targetAsString: unknown): Result<ScanFormula.DateFieldEqualsNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof targetAsString !== 'string') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.DateFieldEqualsTargetIsNotString, `${targetAsString}`);
        } else {
            const target = ScanFormulaZenithEncodingService.DateValue.tryDecodeDate(targetAsString);
            if (target === undefined) {
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TargetHasInvalidDateFormat, targetAsString);
            } else {
                const node = new ScanFormula.DateFieldEqualsNode();
                node.fieldId = fieldId;
                node.value = target;
                return new Ok(node);
            }
        }
    }

    private tryDecodeDateFieldInRangeNode(fieldId: ScanFormula.DateRangeFieldId, min: unknown, max: unknown): Result<ScanFormula.DateFieldInRangeNode, ScanFormulaZenithEncodingService.DecodeError> {
        let minDate: SourceTzOffsetDate | undefined;
        if (min === undefined) {
            minDate = undefined;
        } else {
            if (typeof min !== 'string') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinIsDefinedButNotString, `${min}`);
            } else {
                minDate = ScanFormulaZenithEncodingService.DateValue.tryDecodeDate(min);
                if (minDate === undefined) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinHasInvalidDateFormat, min);
                }
            }
        }

        let maxDate: SourceTzOffsetDate | undefined;
        if (max === undefined) {
            maxDate = undefined;
        } else {
            if (typeof max !== 'string') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMaxIsDefinedButNotString, `${max}`);
            } else {
                maxDate = ScanFormulaZenithEncodingService.DateValue.tryDecodeDate(max);
                if (maxDate === undefined) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMaxHasInvalidDateFormat, max);
                }
            }
        }

        if (minDate === undefined && maxDate === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinAndMaxAreBothUndefined, undefined);
        } else {
            const node = new ScanFormula.DateFieldInRangeNode();
            node.fieldId = fieldId;
            node.min = minDate;
            node.max = maxDate;
            return new Ok(node);
        }
    }

    private tryDecodeTextFieldContainsNode(fieldId: ScanFormula.TextContainsFieldId, value: unknown, as: unknown, ignoreCase: unknown):
            Result<ScanFormula.TextFieldContainsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const propertiesResult = ScanFormulaZenithEncodingService.TextFieldContainsProperties.resolveFromUnknown(value, as, ignoreCase);
        if (propertiesResult.isErr()) {
            return propertiesResult.createType();
        } else {
            const properties = propertiesResult.value;
            const node = new ScanFormula.TextFieldContainsNode();
            node.fieldId = fieldId;
            node.value = properties.value;
            node.asId = properties.asId;
            node.ignoreCase = properties.ignoreCase;
            return new Ok(node);
        }
    }

    // private tryDecodeBooleanFieldEqualsNode(fieldId: ScanFormula.BooleanFieldId, param1: unknown): Result<ScanFormula.BooleanFieldEqualsNode, ScanFormulaZenithEncoding.DecodeError> {
    //     if (typeof param1 !== 'boolean') {
    //         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    //         return createDecodeErrorResult(ScanFormulaZenithEncoding.ErrorId.BooleanFieldEqualsTargetIsNotBoolean, `${param1}`);
    //     } else {
    //         const node = new ScanFormula.BooleanFieldEqualsNode();
    //         node.fieldId = fieldId;
    //         node.target = param1;
    //         return new Ok(node);
    //     }
    // }

    private tryDecodeNumericRangeSubbedFieldEqualsNode(
        fieldId: ScanFormula.NumericRangeSubbedFieldId,
        subField: unknown,
        param2: unknown
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof subField !== 'string') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SubFieldIsNotString, `${subField}`);
        } else {
            if (typeof param2 !== 'number') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TargetIsNotNumber, `${param2}`);
            } else {
                switch (fieldId) {
                    case ScanFormula.FieldId.PriceSubbed: return this.tryDecodePriceSubFieldEqualsNode(subField, param2);
                    default:
                        throw new UnreachableCaseError('ZSTDNRSFEN10008', fieldId);
                }
            }
        }
    }

    private tryDecodeDateRangeSubbedFieldEqualsNode(
        fieldId: ScanFormula.DateRangeSubbedFieldId,
        subField: unknown,
        param2: unknown
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof subField !== 'string') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SubFieldIsNotString, `${subField}`);
        } else {
            if (typeof param2 !== 'string') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.DateSubFieldEqualsTargetIsNotString, `${param2}`);
            } else {
                const targetAsDate = ScanFormulaZenithEncodingService.DateValue.tryDecodeDate(param2);
                if (targetAsDate === undefined) {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.TargetHasInvalidDateFormat, param2);
                } else {
                    switch (fieldId) {
                        case ScanFormula.FieldId.DateSubbed: return this.tryDecodeDateSubFieldEqualsNode(subField, targetAsDate);
                        default:
                            throw new UnreachableCaseError('ZSCCTTSFEOCN10008', fieldId);
                    }
                }
            }
        }
    }


    private tryDecodeTextSubbedFieldContainsNode(
        fieldId: ScanFormula.TextContainsSubbedFieldId,
        subField: unknown,
        value: unknown,
        as: unknown,
        ignoreCase: unknown
    ): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof subField !== 'string') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SubFieldIsNotString, `${subField}`);
        } else {
            const propertiesResult = ScanFormulaZenithEncodingService.TextFieldContainsProperties.resolveFromUnknown(value, as, ignoreCase);
            if (propertiesResult.isErr()) {
                return propertiesResult.createType();
            } else {
                const properties = propertiesResult.value;
                switch (fieldId) {
                    case ScanFormula.FieldId.AltCodeSubbed: return this.tryDecodeAltCodeSubFieldContains(subField, properties.value, properties.asId, properties.ignoreCase);
                    case ScanFormula.FieldId.AttributeSubbed: return this.tryDecodeAttributeSubFieldContains(subField, properties.value, properties.asId, properties.ignoreCase);
                    default:
                        throw new UnreachableCaseError('ZSCCTTTSFCN10008', fieldId);
                }
            }
        }
    }

    private tryDecodePriceSubFieldEqualsNode(subField: string, target: number): Result<ScanFormula.PriceSubFieldEqualsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subFieldId = ScanFormulaZenithEncodingService.PriceSubField.tryDecodeId(subField as ZenithEncodedScanFormula.PriceSubFieldEnum);
        if (subFieldId === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.PriceSubFieldEqualsSubFieldIsUnknown, subField);
        } else {
            const node = new ScanFormula.PriceSubFieldEqualsNode();
            node.fieldId = ScanFormula.FieldId.PriceSubbed;
            node.subFieldId = subFieldId;
            node.value = target;
            return new Ok(node);
        }
    }

    private tryDecodeNumericSubbedFieldInRangeNode(fieldId: ScanFormula.NumericRangeSubbedFieldId, subField: unknown, min: unknown, max: unknown): Result<ScanFormula.FieldBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof subField !== 'string') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SubFieldIsNotString, `${subField}`);
        } else {
            const minUndefined = min === undefined;
            if (!minUndefined && typeof min !== 'number') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinIsDefinedButNotNumber, `${min}`);
            } else {
                const maxUndefined = max === undefined;
                if (!maxUndefined && typeof max !== 'number') {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMaxIsDefinedButNotNumber, `${max}`);
                } else {
                    if (minUndefined && maxUndefined) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinAndMaxAreBothUndefined, undefined);
                    } else {
                        switch (fieldId) {
                            case ScanFormula.FieldId.PriceSubbed: return this.tryDecodePriceSubFieldInRangeNode(subField, min, max);
                            default:
                                throw new UnreachableCaseError('SFZETDNSFIRN43210', fieldId);
                        }
                    }
                }
            }
        }
    }

    private tryDecodePriceSubFieldInRangeNode(subField: string, min: number | undefined, max: number | undefined): Result<ScanFormula.PriceSubFieldInRangeNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subFieldId = ScanFormulaZenithEncodingService.PriceSubField.tryDecodeId(subField as ZenithEncodedScanFormula.PriceSubFieldEnum);
        if (subFieldId === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.PriceSubFieldEqualsSubFieldIsUnknown, subField);
        } else {
            const node = new ScanFormula.PriceSubFieldInRangeNode();
            node.fieldId = ScanFormula.FieldId.PriceSubbed;
            node.subFieldId = subFieldId;
            node.min = min;
            node.max = max;
            return new Ok(node);
        }
    }

    private tryDecodeDateSubFieldEqualsNode(subField: string, target: SourceTzOffsetDate): Result<ScanFormula.DateSubFieldEqualsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subFieldId = ScanFormulaZenithEncodingService.DateSubField.tryDecodeId(subField as ZenithEncodedScanFormula.DateSubFieldEnum);
        if (subFieldId === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.DateSubFieldEqualsSubFieldIsUnknown, subField);
        } else {
            const node = new ScanFormula.DateSubFieldEqualsNode();
            node.fieldId = ScanFormula.FieldId.DateSubbed;
            node.subFieldId = subFieldId;
            node.value = target;
            return new Ok(node);
        }
    }

    private tryDecodeDateSubbedFieldInRangeNode(
        fieldId: ScanFormula.DateRangeSubbedFieldId,
        subField: unknown,
        min: unknown,
        max: unknown
    ): Result<ScanFormula.DateSubFieldInRangeNode, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof subField !== 'string') {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.SubFieldIsNotString, `${subField}`);
        } else {
            let minDate: SourceTzOffsetDate | undefined;
            if (min === undefined) {
                minDate = undefined;
            } else {
                if (typeof min !== 'string') {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinIsDefinedButNotString, `${min}`);
                } else {
                    minDate = ScanFormulaZenithEncodingService.DateValue.tryDecodeDate(min);
                    if (minDate === undefined) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinHasInvalidDateFormat, min);
                    }
                }
            }

            let maxDate: SourceTzOffsetDate | undefined;
            if (max === undefined) {
                maxDate = undefined;
            } else {
                if (typeof max !== 'string') {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMaxIsDefinedButNotString, `${max}`);
                } else {
                    maxDate = ScanFormulaZenithEncodingService.DateValue.tryDecodeDate(max);
                    if (maxDate === undefined) {
                        return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMaxHasInvalidDateFormat, max);
                    }
                }
            }

            if (minDate === undefined && maxDate === undefined) {
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.RangeMinAndMaxAreBothUndefined, undefined);
            } else {
                switch (fieldId) {
                    case ScanFormula.FieldId.DateSubbed: return this.tryDecodeDateSubFieldInRangeNode(subField, minDate, maxDate);
                    default:
                        throw new UnreachableCaseError('SFZETDNSFIRN43210', fieldId);
                }
            }
        }
    }

    private tryDecodeDateSubFieldInRangeNode(
        subField: string,
        min: SourceTzOffsetDate | undefined,
        max: SourceTzOffsetDate | undefined
    ): Result<ScanFormula.DateSubFieldInRangeNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subFieldId = ScanFormulaZenithEncodingService.DateSubField.tryDecodeId(subField as ZenithEncodedScanFormula.DateSubFieldEnum);
        if (subFieldId === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.DateSubFieldEqualsSubFieldIsUnknown, subField);
        } else {
            const node = new ScanFormula.DateSubFieldInRangeNode();
            node.fieldId = ScanFormula.FieldId.DateSubbed;
            node.subFieldId = subFieldId;
            node.min = min;
            node.max = max;
            return new Ok(node);
        }
    }

    private tryDecodeAltCodeSubFieldContains(subField: string, value: string, asId: ScanFormula.TextContainsAsId, ignoreCase: boolean): Result<ScanFormula.AltCodeSubFieldContainsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subFieldId = ScanFormulaZenithEncodingService.AltCodeSubField.tryDecodeId(subField as ZenithEncodedScanFormula.AltCodeSubField);
        if (subFieldId === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.AltCodeSubFieldContainsSubFieldIsUnknown, subField);
        } else {
            const node = new ScanFormula.AltCodeSubFieldContainsNode();
            node.fieldId = ScanFormula.FieldId.AltCodeSubbed;
            node.subFieldId = subFieldId;
            node.value = value;
            node.asId = asId;
            node.ignoreCase = ignoreCase;
            return new Ok(node);
        }
    }

    private tryDecodeAttributeSubFieldContains(subField: string, value: string, asId: ScanFormula.TextContainsAsId, ignoreCase: boolean): Result<ScanFormula.AttributeSubFieldContainsNode, ScanFormulaZenithEncodingService.DecodeError> {
        const subFieldId = ScanFormulaZenithEncodingService.AttributeSubField.tryDecodeId(subField as ZenithEncodedScanFormula.AttributeSubField);
        if (subFieldId === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.AttributeSubFieldContainsSubFieldIsUnknown, subField);
        } else {
            const node = new ScanFormula.AttributeSubFieldContainsNode();
            node.fieldId = ScanFormula.FieldId.AttributeSubbed;
            node.subFieldId = subFieldId;
            node.value = value;
            node.asId = asId;
            node.ignoreCase = ignoreCase;
            return new Ok(node);
        }
    }

    private tryDecodeNumericComparisonNode(
        tulipNode: ZenithEncodedScanFormula.ComparisonTupleNode,
        nodeConstructor: new() => ScanFormula.NumericComparisonBooleanNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress,
    ): Result<ScanFormula.NumericComparisonBooleanNode, ScanFormulaZenithEncodingService.DecodeError> {
        const nodeType = tulipNode[0];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (tulipNode.length !== 3) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NumericComparisonDoesNotHave2Operands, nodeType);
        } else {
            const leftParam = tulipNode[1] as ZenithEncodedScanFormula.NumericParam;
            const leftOperandResult = this.tryDecodeExpectedNumericOperand(leftParam, `${nodeType}/${Strings[StringId.Left]}`, strict, toProgress);
            if (leftOperandResult.isErr()) {
                return leftOperandResult.createType();
            } else {
                const rightParam = tulipNode[2] as ZenithEncodedScanFormula.NumericParam;
                const rightOperandResult = this.tryDecodeExpectedNumericOperand(rightParam, `${nodeType}/${Strings[StringId.Right]}`, strict, toProgress);
                if (rightOperandResult.isErr()) {
                    return rightOperandResult.createType();
                } else {
                    const resultNode = new nodeConstructor();
                    resultNode.leftOperand = leftOperandResult.value;
                    resultNode.rightOperand = rightOperandResult.value;
                    return new Ok(resultNode);
                }
            }
        }
    }

    private tryDecodeExpectedNumericOperand(
        numericParam: unknown, // ZenithScanCriteria.NumericParam,
        paramId: string,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress,
    ): Result<ScanFormula.NumericNode | number, ScanFormulaZenithEncodingService.DecodeError> {
        if (typeof numericParam === 'number') {
            return new Ok(numericParam);
        } else {
            if (typeof numericParam === 'string') {
                return this.tryDecodeNumericFieldValueGet(numericParam as ZenithEncodedScanFormula.FieldTupleNodeType);
            } else {
                if (Array.isArray(numericParam)) {
                    return this.tryDecodeExpectedArithmeticNumericNode(numericParam as ZenithEncodedScanFormula.NumericTupleNode, strict, toProgress);
                } else {
                    return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NumericParameterIsNotNumberOrComparableFieldOrArray, paramId);
                }
            }
        }
    }

    private tryDecodeExpectedArithmeticNumericNode(
        numericTupleNode: ZenithEncodedScanFormula.NumericTupleNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.NumericNode, ScanFormulaZenithEncodingService.DecodeError> {
        toProgress.enterTupleNode();
        const tupleNodeLength = numericTupleNode.length;
        if (tupleNodeLength < 1 ) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NumericTupleNodeIsZeroLength, undefined);
        } else {
            const nodeType = numericTupleNode[0];
            if (typeof nodeType !== 'string') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NumericTupleNodeTypeIsNotString, `${nodeType}`);
            } else {
                const decodedNode = toProgress.addDecodedNode(nodeType);

                const result = this.tryDecodeNumericNode(numericTupleNode, strict, toProgress)

                if (result.isOk()) {
                    toProgress.exitTupleNode(decodedNode, result.value.typeId);
                }

                return result;
            }
        }
    }

    private tryDecodeNumericNode(
        numericTupleNode: ZenithEncodedScanFormula.NumericTupleNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.NumericNode, ScanFormulaZenithEncodingService.DecodeError> {
        const tupleNodetype = numericTupleNode[0] as ZenithEncodedScanFormula.ExpressionTupleNodeType;
        switch (tupleNodetype) {
            // Binary
            case ZenithEncodedScanFormula.AddTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericAddNode, strict, toProgress);
            case ZenithEncodedScanFormula.DivSymbolTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericDivNode, strict, toProgress);
            case ZenithEncodedScanFormula.DivTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericDivNode, strict, toProgress);
            case ZenithEncodedScanFormula.ModSymbolTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericModNode, strict, toProgress);
            case ZenithEncodedScanFormula.ModTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericModNode, strict, toProgress);
            case ZenithEncodedScanFormula.MulSymbolTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericMulNode, strict, toProgress);
            case ZenithEncodedScanFormula.MulTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericMulNode, strict, toProgress);
            case ZenithEncodedScanFormula.SubTupleNodeType:
                return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, ScanFormula.NumericSubNode, strict, toProgress);

            // Unary
            case ZenithEncodedScanFormula.NegTupleNodeType:
                return this.tryDecodeUnaryArithmeticNumericNode(numericTupleNode as ZenithEncodedScanFormula.UnaryExpressionTupleNode, ScanFormula.NumericNegNode, strict, toProgress);
            case ZenithEncodedScanFormula.PosTupleNodeType:
                return this.tryDecodeUnaryArithmeticNumericNode(numericTupleNode as ZenithEncodedScanFormula.UnaryExpressionTupleNode, ScanFormula.NumericPosNode, strict, toProgress);
            case ZenithEncodedScanFormula.AbsTupleNodeType:
                return this.tryDecodeUnaryArithmeticNumericNode(numericTupleNode as ZenithEncodedScanFormula.UnaryExpressionTupleNode, ScanFormula.NumericAbsNode, strict, toProgress);

            // Unary or Binary (depending on number of params)
            case ZenithEncodedScanFormula.SubOrNegSymbolTupleNodeType:
                return this.tryDecodeUnaryOrLeftRightArithmeticNumericNode(
                    numericTupleNode as ZenithEncodedScanFormula.UnaryExpressionTupleNode | ZenithEncodedScanFormula.BinaryExpressionTupleNode,
                    ScanFormula.NumericNegNode,
                    ScanFormula.NumericSubNode,
                    strict,
                    toProgress
                );
            case ZenithEncodedScanFormula.AddOrPosSymbolTupleNodeType:
                return this.tryDecodeUnaryOrLeftRightArithmeticNumericNode(
                    numericTupleNode as ZenithEncodedScanFormula.UnaryExpressionTupleNode | ZenithEncodedScanFormula.BinaryExpressionTupleNode,
                    ScanFormula.NumericPosNode,
                    ScanFormula.NumericAddNode,
                    strict,
                    toProgress
                );

            case ZenithEncodedScanFormula.IfTupleNodeType:
                return this.tryDecodeNumericIfNode(numericTupleNode as ZenithEncodedScanFormula.IfTupleNode, strict, toProgress);

            default: {
                const neverTupleNodeType: never = tupleNodetype;
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownNumericTupleNodeType, `${neverTupleNodeType}`);
            }
        }
    }

    private tryDecodeUnaryArithmeticNumericNode(
        numericTupleNode: ZenithEncodedScanFormula.UnaryExpressionTupleNode,
        nodeConstructor: new() => ScanFormula.UnaryArithmeticNumericNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.NumericNode, ScanFormulaZenithEncodingService.DecodeError> {
        const nodeLength = numericTupleNode.length;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (nodeLength !== 2) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnaryArithmeticNumericTupleNodeRequires2Parameters, `${numericTupleNode}`);
        } else {
            const param = numericTupleNode[1];
            const operandResult = this.tryDecodeExpectedNumericOperand(param, '', strict, toProgress);
            if (operandResult.isErr()) {
                return operandResult.createType();
            } else {
                const node = new nodeConstructor();
                node.operand = operandResult.value;
                return new Ok(node);
            }
        }
    }

    private tryDecodeLeftRightArithmeticNumericNode(
        numericTupleNode: ZenithEncodedScanFormula.NumericTupleNode,
        nodeConstructor: new() => ScanFormula.LeftRightArithmeticNumericNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.NumericNode, ScanFormulaZenithEncodingService.DecodeError> {
        const nodeLength = numericTupleNode.length;
        if (nodeLength !== 3) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.LeftRightArithmeticNumericTupleNodeRequires3Parameters, nodeLength.toString());
        } else {
            const binaryExpressionTupleNode = numericTupleNode as ZenithEncodedScanFormula.BinaryExpressionTupleNode
            const leftParam = binaryExpressionTupleNode[1];
            const leftResult = this.tryDecodeExpectedNumericOperand(leftParam, Strings[StringId.Left], strict, toProgress);
            if (leftResult.isErr()) {
                return leftResult.createType();
            } else {
                const rightParam = binaryExpressionTupleNode[2];
                const rightResult = this.tryDecodeExpectedNumericOperand(rightParam, Strings[StringId.Right], strict, toProgress);
                if (rightResult.isErr()) {
                    return rightResult.createType();
                } else {
                    const node = new nodeConstructor();
                    node.leftOperand = leftResult.value;
                    node.rightOperand = rightResult.value;
                    return new Ok(node);
                }
            }
        }
    }

    private tryDecodeUnaryOrLeftRightArithmeticNumericNode(
        numericTupleNode: ZenithEncodedScanFormula.UnaryExpressionTupleNode | ZenithEncodedScanFormula.BinaryExpressionTupleNode,
        unaryNodeConstructor: new() => ScanFormula.UnaryArithmeticNumericNode,
        leftRightNodeConstructor: new() => ScanFormula.LeftRightArithmeticNumericNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.NumericNode, ScanFormulaZenithEncodingService.DecodeError> {
        const nodeLength = numericTupleNode.length;
        switch (nodeLength) {
            case 2: return this.tryDecodeUnaryArithmeticNumericNode(numericTupleNode, unaryNodeConstructor, strict, toProgress);
            case 3: return this.tryDecodeLeftRightArithmeticNumericNode(numericTupleNode, leftRightNodeConstructor, strict, toProgress);
            default:
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.NumericTupleNodeRequires2Or3Parameters, `${numericTupleNode}`);
        }
    }

    private tryDecodeNumericIfNode(
        tupleNode: ZenithEncodedScanFormula.IfTupleNode,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.NumericIfNode, ScanFormulaZenithEncodingService.DecodeError> {
        const tupleLength = tupleNode.length;
        if (tupleLength < 5) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.IfTupleNodeRequiresAtLeast4Parameters, `${tupleNode}`);
        } else {
            const armParameters = tupleLength - 1;
            const armsRemainder = armParameters % 2;
            if (armsRemainder !== 0) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.IfTupleNodeRequiresAnEvenNumberOfParameters, `${tupleNode}`);
            } else {
                const armCount = armParameters / 2;
                const trueArmCount = armCount - 1;
                const trueArms = new Array<ScanFormula.NumericIfNode.Arm>(trueArmCount);
                let tupleIndex = 1;
                for (let i = 0; i < trueArmCount; i++) {
                    const armResult = this.tryDecodeNumericIfArm(tupleNode, tupleIndex, strict, toProgress);
                    if (armResult.isErr()) {
                        return armResult.createType();
                    } else {
                        trueArms[i] = armResult.value;
                    }
                    tupleIndex += 2;
                }

                const armResult = this.tryDecodeNumericIfArm(tupleNode, tupleIndex, strict, toProgress);
                if (armResult.isErr()) {
                    return armResult.createType();
                } else {
                    const falseArm = armResult.value;

                    const node = new ScanFormula.NumericIfNode();
                    node.trueArms = trueArms;
                    node.falseArm = falseArm;
                    return new Ok(node);
                }
            }
        }
    }

    private tryDecodeNumericIfArm(
        tupleNode: ZenithEncodedScanFormula.IfTupleNode,
        tupleIndex: Integer,
        strict: boolean,
        toProgress: ScanFormulaZenithEncodingService.DecodeProgress
    ): Result<ScanFormula.NumericIfNode.Arm, ScanFormulaZenithEncodingService.DecodeError> {
        const conditionElement = tupleNode[tupleIndex++] as ZenithEncodedScanFormula.BooleanParam;
        const conditionResult = this.tryDecodeExpectedBooleanOperand(conditionElement, strict, toProgress);
        if (conditionResult.isErr()) {
            return conditionResult.createType();
        } else {
            const valueElement = tupleNode[tupleIndex++] as ZenithEncodedScanFormula.NumericParam;
            const valueResult = this.tryDecodeExpectedNumericOperand(valueElement, tupleIndex.toString(), strict, toProgress);
            if (valueResult.isErr()) {
                return valueResult.createType();
            } else {
                const arm: ScanFormula.NumericIfNode.Arm = {
                    condition: conditionResult.value,
                    value: valueResult.value,
                };
                return new Ok(arm);
            }
        }
    }

    private tryDecodeNumericFieldValueGet(field: ZenithEncodedScanFormula.FieldTupleNodeType): Result<ScanFormula.NumericFieldValueGetNode, ScanFormulaZenithEncodingService.DecodeError> {
        const fieldId = ScanFormulaZenithEncodingService.Field.tryToId(field);
        if (fieldId === undefined) {
            return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownField, field);
        } else {
            if (ScanFormula.Field.idToDataTypeId(fieldId) !== ScanFormula.Field.DataTypeId.Numeric) {
                return ScanFormulaZenithEncodingService.createDecodeErrorResult(ScanFormulaZenithEncodingService.ErrorId.UnknownNumericField, field);
            } else {
                const node = new ScanFormula.NumericFieldValueGetNode();
                node.fieldId = fieldId as ScanFormula.NumericRangeFieldId;
                return new Ok(node);
            }
        }
    }
}

export namespace ScanFormulaZenithEncodingService {
    export class DecodeProgress {
        private _nodeCount = 0;
        private _nodeDepth = 0;
        private _decodedNodes = new Array<DecodeProgress.DecodedNode>(0);

        get tupleNodeCount() { return this._nodeCount; }
        get tupleNodeDepth() { return this._nodeDepth; }
        get decodedNodes(): readonly DecodeProgress.DecodedNode[] { return this._decodedNodes; }

        enterTupleNode() {
            this._nodeDepth++;
            this._nodeCount++;
        }

        addDecodedNode(nodeType: ZenithEncodedScanFormula.TupleNodeType): DecodeProgress.DecodedNode {
            const decodedNode: DecodeProgress.DecodedNode = {
                nodeDepth: this._nodeDepth,
                tupleNodeType: nodeType,
                nodeTypeId: undefined,
            }
            this._decodedNodes.push(decodedNode);

            return decodedNode;
        }

        exitTupleNode(decodedNode: DecodeProgress.DecodedNode, nodeTypeId: ScanFormula.NodeTypeId) {
            decodedNode.nodeTypeId = nodeTypeId;
            this._nodeDepth--;
        }
    }

    export namespace DecodeProgress {
        export interface DecodedNode {
            nodeDepth: number;
            tupleNodeType: ZenithEncodedScanFormula.TupleNodeType;
            nodeTypeId: ScanFormula.NodeTypeId | undefined;
        }
    }

    export interface DecodeError {
        errorId: ErrorId;
        extraErrorText: string | undefined;
    }

    export interface DecodedError {
        error: DecodeError;
        progress: DecodeProgress;
    }

    export interface DecodedBoolean {
        node: ScanFormula.BooleanNode;
        progress: DecodeProgress;
    }

    export interface DecodedNumeric {
        node: ScanFormula.NumericNode;
        progress: DecodeProgress;
    }

    export interface TextFieldContainsProperties {
        readonly value: string;
        readonly asId: ScanFormula.TextContainsAsId;
        readonly ignoreCase: boolean;
    }

    export namespace TextFieldContainsProperties {
        export function resolveFromUnknown(value: unknown, as: unknown, ignoreCase: unknown): Result<TextFieldContainsProperties, DecodeError> {
            if (typeof value !== 'string') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                return createDecodeErrorResult(ErrorId.TextFieldContainsValueIsNotString, `${value}`);
            } else {
                let resolvedAsId: ScanFormula.TextContainsAsId;
                if (as === undefined) {
                    resolvedAsId = ScanFormula.TextContainsAsId.None;
                } else {
                    if (typeof as !== 'string') {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        return createDecodeErrorResult(ErrorId.TextFieldContainsAsIsNotString, `${as}`);
                    } else {
                        const asId = TextContainsAs.tryDecodeId(as as ZenithEncodedScanFormula.TextContainsAsEnum);
                        if (asId === undefined) {
                            return createDecodeErrorResult(ErrorId.TextFieldContainsAsHasInvalidFormat, as);
                        } else {
                            resolvedAsId = asId;
                        }
                    }
                }

                let resolvedIgnoreCase: boolean;
                if (ignoreCase === undefined) {
                    resolvedIgnoreCase = false;
                } else {
                    if (typeof ignoreCase !== 'boolean') {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        return createDecodeErrorResult(ErrorId.TextFieldContainsAsIsNotBoolean, `${ignoreCase}`);
                    } else {
                        resolvedIgnoreCase = ignoreCase;
                    }
                }

                const properties: TextFieldContainsProperties = {
                    value,
                    asId: resolvedAsId,
                    ignoreCase: resolvedIgnoreCase,
                }
                return new Ok(properties);
            }
        }
    }

    export namespace Field {
        export function tryToId(value: ZenithEncodedScanFormula.FieldTupleNodeType): ScanFormula.FieldId | undefined {
            switch (value) {
                // Numeric
                case ZenithEncodedScanFormula.AuctionTupleNodeType: return ScanFormula.FieldId.Auction;
                case ZenithEncodedScanFormula.AuctionLastTupleNodeType: return ScanFormula.FieldId.AuctionLast;
                case ZenithEncodedScanFormula.AuctionQuantityTupleNodeType: return ScanFormula.FieldId.AuctionQuantity;
                case ZenithEncodedScanFormula.BestAskCountTupleNodeType: return ScanFormula.FieldId.BestAskCount;
                case ZenithEncodedScanFormula.BestAskPriceTupleNodeType: return ScanFormula.FieldId.BestAskPrice;
                case ZenithEncodedScanFormula.BestAskQuantityTupleNodeType: return ScanFormula.FieldId.BestAskQuantity;
                case ZenithEncodedScanFormula.BestBidCountTupleNodeType: return ScanFormula.FieldId.BestBidCount;
                case ZenithEncodedScanFormula.BestBidPriceTupleNodeType: return ScanFormula.FieldId.BestBidPrice;
                case ZenithEncodedScanFormula.BestBidQuantityTupleNodeType: return ScanFormula.FieldId.BestBidQuantity;
                case ZenithEncodedScanFormula.ClosePriceTupleNodeType: return ScanFormula.FieldId.ClosePrice;
                case ZenithEncodedScanFormula.ContractSizeTupleNodeType: return ScanFormula.FieldId.ContractSize;
                case ZenithEncodedScanFormula.HighPriceTupleNodeType: return ScanFormula.FieldId.HighPrice;
                case ZenithEncodedScanFormula.LastPriceTupleNodeType: return ScanFormula.FieldId.LastPrice;
                case ZenithEncodedScanFormula.LotSizeTupleNodeType: return ScanFormula.FieldId.LotSize;
                case ZenithEncodedScanFormula.LowPriceTupleNodeType: return ScanFormula.FieldId.LowPrice;
                case ZenithEncodedScanFormula.OpenInterestTupleNodeType: return ScanFormula.FieldId.OpenInterest;
                case ZenithEncodedScanFormula.OpenPriceTupleNodeType: return ScanFormula.FieldId.OpenPrice;
                case ZenithEncodedScanFormula.PreviousCloseTupleNodeType: return ScanFormula.FieldId.PreviousClose;
                case ZenithEncodedScanFormula.RemainderTupleNodeType: return ScanFormula.FieldId.Remainder;
                case ZenithEncodedScanFormula.ShareIssueTupleNodeType: return ScanFormula.FieldId.ShareIssue;
                case ZenithEncodedScanFormula.StrikePriceTupleNodeType: return ScanFormula.FieldId.StrikePrice;
                case ZenithEncodedScanFormula.TradesTupleNodeType: return ScanFormula.FieldId.Trades;
                case ZenithEncodedScanFormula.ValueTradedTupleNodeType: return ScanFormula.FieldId.ValueTraded;
                case ZenithEncodedScanFormula.VolumeTupleNodeType: return ScanFormula.FieldId.Volume;
                case ZenithEncodedScanFormula.VwapTupleNodeType: return ScanFormula.FieldId.Vwap;
                // Numeric Subbed
                case ZenithEncodedScanFormula.PriceTupleNodeType: return ScanFormula.FieldId.PriceSubbed;
                // Date
                case ZenithEncodedScanFormula.ExpiryDateTupleNodeType: return ScanFormula.FieldId.ExpiryDate;
                // Date Subbed
                case ZenithEncodedScanFormula.DateTupleNodeType: return ScanFormula.FieldId.DateSubbed;
                // Text
                case ZenithEncodedScanFormula.BoardTupleNodeType: return ScanFormula.FieldId.MarketBoard;
                case ZenithEncodedScanFormula.CallOrPutTupleNodeType: return ScanFormula.FieldId.CallOrPut;
                case ZenithEncodedScanFormula.CategoryTupleNodeType: return ScanFormula.FieldId.Category;
                case ZenithEncodedScanFormula.CfiTupleNodeType: return ScanFormula.FieldId.Cfi;
                case ZenithEncodedScanFormula.ClassTupleNodeType: return ScanFormula.FieldId.Class;
                case ZenithEncodedScanFormula.CodeTupleNodeType: return ScanFormula.FieldId.Code;
                case ZenithEncodedScanFormula.CurrencyTupleNodeType: return ScanFormula.FieldId.Currency;
                case ZenithEncodedScanFormula.DataTupleNodeType: return ScanFormula.FieldId.Data;
                case ZenithEncodedScanFormula.ExchangeTupleNodeType: return ScanFormula.FieldId.Exchange;
                case ZenithEncodedScanFormula.ExerciseTypeTupleNodeType: return ScanFormula.FieldId.ExerciseType;
                case ZenithEncodedScanFormula.LegTupleNodeType: return ScanFormula.FieldId.Leg;
                case ZenithEncodedScanFormula.MarketTupleNodeType: return ScanFormula.FieldId.Market;
                case ZenithEncodedScanFormula.NameTupleNodeType: return ScanFormula.FieldId.Name;
                case ZenithEncodedScanFormula.QuotationBasisTupleNodeType: return ScanFormula.FieldId.QuotationBasis;
                case ZenithEncodedScanFormula.StateTupleNodeType: return ScanFormula.FieldId.TradingStateName;
                case ZenithEncodedScanFormula.StateAllowsTupleNodeType: return ScanFormula.FieldId.TradingStateAllows;
                case ZenithEncodedScanFormula.StatusNoteTupleNodeType: return ScanFormula.FieldId.StatusNote;
                case ZenithEncodedScanFormula.TradingMarketTupleNodeType: return ScanFormula.FieldId.TradingMarket;
                // Text Subbed
                case ZenithEncodedScanFormula.AltCodeTupleNodeType: return ScanFormula.FieldId.AltCodeSubbed;
                case ZenithEncodedScanFormula.AttributeTupleNodeType: return ScanFormula.FieldId.AttributeSubbed;
                // Boolean
                case ZenithEncodedScanFormula.IsIndexTupleNodeType: return undefined;
                default: {
                    const ignoredValue: never = value;
                    return undefined;
                }
            }
        }

        export function fromId(value: ScanFormula.FieldId): ZenithEncodedScanFormula.MatchingFieldTupleNodeType {
            const styleId = ScanFormula.Field.idToStyleId(value);
            const dataTypeId = ScanFormula.Field.idToDataTypeId(value);
            switch (styleId) {
                case ScanFormula.Field.StyleId.InRange:
                    switch (dataTypeId) {
                        case ScanFormula.Field.DataTypeId.Numeric: return numericRangeFromId(value as ScanFormula.NumericRangeFieldId);
                        case ScanFormula.Field.DataTypeId.Date: return dateRangeFromId(value as ScanFormula.DateRangeFieldId);
                        case ScanFormula.Field.DataTypeId.Text:
                        case ScanFormula.Field.DataTypeId.Boolean:
                            throw new AssertInternalError('SCZEFFIRTB69871', dataTypeId.toString());
                        default:
                            throw new UnreachableCaseError('SCZEFFIRD69871', dataTypeId);
                    }
                case ScanFormula.Field.StyleId.Overlaps: {
                    if (dataTypeId !== ScanFormula.Field.DataTypeId.Text) {
                        throw new AssertInternalError('SCZEFFIM69871', dataTypeId.toString());
                    } else {
                        return textOverlapFromId(value as ScanFormula.TextOverlapFieldId);
                    }
                }
                case ScanFormula.Field.StyleId.Equals:
                    switch (dataTypeId) {
                        case ScanFormula.Field.DataTypeId.Text: return textSingleFromId(value as ScanFormula.TextSingleFieldId);
                        case ScanFormula.Field.DataTypeId.Numeric:
                        case ScanFormula.Field.DataTypeId.Date:
                        case ScanFormula.Field.DataTypeId.Boolean:
                            throw new AssertInternalError('SCZEFFISU69871', dataTypeId.toString());
                        default:
                            throw new UnreachableCaseError('SCZEFFISD69871', dataTypeId);
                    }
                case ScanFormula.Field.StyleId.HasValueEquals:
                    throw new AssertInternalError('SFZEFFISE', 'not implemented');
                case ScanFormula.Field.StyleId.Contains:
                    switch (dataTypeId) {
                        case ScanFormula.Field.DataTypeId.Text: return textTextFromId(value as ScanFormula.TextContainsFieldId);
                        case ScanFormula.Field.DataTypeId.Numeric:
                        case ScanFormula.Field.DataTypeId.Date:
                        case ScanFormula.Field.DataTypeId.Boolean:
                            throw new AssertInternalError('SCZEFFITU69871', dataTypeId.toString());
                        default:
                            throw new UnreachableCaseError('SCZEFFITD69871', dataTypeId);
                    }
            }
        }

        export function dateRangeFromId(value: ScanFormula.DateRangeFieldId): ZenithEncodedScanFormula.DateRangeFieldTupleNodeType {
            const result = tryDateFromId(value);
            if (result === undefined) {
                throw new AssertInternalError('ZSCCFDFI16179', `${value}`);
            } else {
                return result;
            }
        }

        function tryDateFromId(value: ScanFormula.DateRangeFieldId): ZenithEncodedScanFormula.DateRangeFieldTupleNodeType | undefined {
            switch (value) {
                case ScanFormula.FieldId.ExpiryDate: return ZenithEncodedScanFormula.ExpiryDateTupleNodeType;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function numericRangeFromId(value: ScanFormula.NumericRangeFieldId): ZenithEncodedScanFormula.NumericRangeFieldTupleNodeType {
            const result = tryNumericRangeFromId(value);
            if (result === undefined) {
                throw new AssertInternalError('ZSCCFNFI16179', `${value}`);
            } else {
                return result;
            }
        }

        function tryNumericRangeFromId(value: ScanFormula.NumericRangeFieldId): ZenithEncodedScanFormula.NumericRangeFieldTupleNodeType | undefined {
            switch (value) {
                case ScanFormula.FieldId.Auction: return ZenithEncodedScanFormula.AuctionTupleNodeType;
                case ScanFormula.FieldId.AuctionLast: return ZenithEncodedScanFormula.AuctionLastTupleNodeType;
                case ScanFormula.FieldId.AuctionQuantity: return ZenithEncodedScanFormula.AuctionQuantityTupleNodeType;
                case ScanFormula.FieldId.BestAskCount: return ZenithEncodedScanFormula.BestAskCountTupleNodeType;
                case ScanFormula.FieldId.BestAskPrice: return ZenithEncodedScanFormula.BestAskPriceTupleNodeType;
                case ScanFormula.FieldId.BestAskQuantity: return ZenithEncodedScanFormula.BestAskQuantityTupleNodeType;
                case ScanFormula.FieldId.BestBidCount: return ZenithEncodedScanFormula.BestBidCountTupleNodeType;
                case ScanFormula.FieldId.BestBidPrice: return ZenithEncodedScanFormula.BestBidPriceTupleNodeType;
                case ScanFormula.FieldId.BestBidQuantity: return ZenithEncodedScanFormula.BestBidQuantityTupleNodeType;
                case ScanFormula.FieldId.ClosePrice: return ZenithEncodedScanFormula.ClosePriceTupleNodeType;
                case ScanFormula.FieldId.ContractSize: return ZenithEncodedScanFormula.ContractSizeTupleNodeType;
                case ScanFormula.FieldId.HighPrice: return ZenithEncodedScanFormula.HighPriceTupleNodeType;
                case ScanFormula.FieldId.LastPrice: return ZenithEncodedScanFormula.LastPriceTupleNodeType;
                case ScanFormula.FieldId.LotSize: return ZenithEncodedScanFormula.LotSizeTupleNodeType;
                case ScanFormula.FieldId.LowPrice: return ZenithEncodedScanFormula.LowPriceTupleNodeType;
                case ScanFormula.FieldId.OpenInterest: return ZenithEncodedScanFormula.OpenInterestTupleNodeType;
                case ScanFormula.FieldId.OpenPrice: return ZenithEncodedScanFormula.OpenPriceTupleNodeType;
                case ScanFormula.FieldId.PreviousClose: return ZenithEncodedScanFormula.PreviousCloseTupleNodeType;
                case ScanFormula.FieldId.Remainder: return ZenithEncodedScanFormula.RemainderTupleNodeType;
                case ScanFormula.FieldId.ShareIssue: return ZenithEncodedScanFormula.ShareIssueTupleNodeType;
                case ScanFormula.FieldId.StrikePrice: return ZenithEncodedScanFormula.StrikePriceTupleNodeType;
                case ScanFormula.FieldId.Trades: return ZenithEncodedScanFormula.TradesTupleNodeType;
                case ScanFormula.FieldId.ValueTraded: return ZenithEncodedScanFormula.ValueTradedTupleNodeType;
                case ScanFormula.FieldId.Volume: return ZenithEncodedScanFormula.VolumeTupleNodeType;
                case ScanFormula.FieldId.Vwap: return ZenithEncodedScanFormula.VwapTupleNodeType;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function textTextFromId(value: ScanFormula.TextContainsFieldId): ZenithEncodedScanFormula.TextTextFieldTupleNodeType {
            const result = tryTextTextFromId(value);
            if (result === undefined) {
                throw new AssertInternalError('ZSCCFTTFI16179', `${value}`);
            } else {
                return result;
            }
        }

        function tryTextTextFromId(value: ScanFormula.TextContainsFieldId): ZenithEncodedScanFormula.TextTextFieldTupleNodeType | undefined {
            switch (value) {
                case ScanFormula.FieldId.Code: return ZenithEncodedScanFormula.CodeTupleNodeType;
                case ScanFormula.FieldId.Name: return ZenithEncodedScanFormula.NameTupleNodeType;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function textSingleFromId(value: ScanFormula.TextSingleFieldId): ZenithEncodedScanFormula.TextSingleFieldTupleNodeType {
            const result = tryTextSingleFromId(value);
            if (result === undefined) {
                throw new AssertInternalError('ZSCCFTSFI16179', `${value}`);
            } else {
                return result;
            }
        }

        function tryTextSingleFromId(value: ScanFormula.TextSingleFieldId): ZenithEncodedScanFormula.TextSingleFieldTupleNodeType | undefined {
            switch (value) {
                case ScanFormula.FieldId.CallOrPut: return ZenithEncodedScanFormula.CallOrPutTupleNodeType;
                case ScanFormula.FieldId.Cfi: return ZenithEncodedScanFormula.CfiTupleNodeType;
                case ScanFormula.FieldId.Class: return ZenithEncodedScanFormula.ClassTupleNodeType;
                case ScanFormula.FieldId.Data: return ZenithEncodedScanFormula.DataTupleNodeType;
                case ScanFormula.FieldId.ExerciseType: return ZenithEncodedScanFormula.ExerciseTypeTupleNodeType;
                case ScanFormula.FieldId.Leg: return ZenithEncodedScanFormula.LegTupleNodeType;
                case ScanFormula.FieldId.TradingStateAllows: return ZenithEncodedScanFormula.StateAllowsTupleNodeType;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function textOverlapFromId(value: ScanFormula.TextOverlapFieldId): ZenithEncodedScanFormula.TextMultipleFieldTupleNodeType {
            const result = tryMultipleFromId(value);
            if (result === undefined) {
                throw new AssertInternalError('ZSCCFMFI16179', `${value}`);
            } else {
                return result;
            }
        }

        function tryMultipleFromId(value: ScanFormula.TextOverlapFieldId): ZenithEncodedScanFormula.TextMultipleFieldTupleNodeType | undefined {
            switch (value) {
                case ScanFormula.FieldId.MarketBoard: return ZenithEncodedScanFormula.BoardTupleNodeType;
                case ScanFormula.FieldId.Category: return ZenithEncodedScanFormula.CategoryTupleNodeType;
                case ScanFormula.FieldId.Currency: return ZenithEncodedScanFormula.CurrencyTupleNodeType;
                case ScanFormula.FieldId.Exchange: return ZenithEncodedScanFormula.ExchangeTupleNodeType;
                case ScanFormula.FieldId.Market: return ZenithEncodedScanFormula.MarketTupleNodeType;
                case ScanFormula.FieldId.QuotationBasis: return ZenithEncodedScanFormula.QuotationBasisTupleNodeType;
                case ScanFormula.FieldId.TradingStateName: return ZenithEncodedScanFormula.StateTupleNodeType;
                case ScanFormula.FieldId.StatusNote: return ZenithEncodedScanFormula.StatusNoteTupleNodeType;
                case ScanFormula.FieldId.TradingMarket: return ZenithEncodedScanFormula.TradingMarketTupleNodeType;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        // export function tryBooleanToId(value: ZenithEncodedScanFormula.BooleanFieldTupleNodeType): ScanFormula.BooleanFieldId | undefined {
        //     switch (value) {
        //         case ZenithEncodedScanFormula.IsIndexTupleNodeType: return ScanFormula.FieldId.IsIndex;
        //         default:
        //             return undefined;
        //     }
        // }

        // export function booleanFromId(value: ScanFormula.BooleanFieldId): ZenithEncodedScanFormula.BooleanFieldTupleNodeType {
        //     const result = tryBooleanFromId(value);
        //     if (result === undefined) {
        //         throw new AssertInternalError('ZSCCFBFI16179', `${value}`);
        //     } else {
        //         return result;
        //     }
        // }

        // function tryBooleanFromId(value: ScanFormula.BooleanFieldId): ZenithEncodedScanFormula.BooleanFieldTupleNodeType | undefined {
        //     switch (value) {
        //         case ScanFormula.FieldId.IsIndex: return ZenithEncodedScanFormula.IsIndexTupleNodeType;
        //         default: {
        //             const neverValueIgnored: never = value;
        //             return undefined;
        //         }
        //     }
        // }
    }

    export namespace Is {
        export namespace Category {
            export function idToDefaultTrueFalse(categoryId: ScanFormula.IsNode.CategoryId) {
                switch (categoryId) {
                    case ScanFormula.IsNode.CategoryId.Index: return ZenithEncodedScanFormula.SingleDefault_IsIndex;
                    default:
                        throw new UnreachableCaseError('SFZEICITD69312', categoryId);
                }
            }

            export function idToTupleNodeType(categoryId: ScanFormula.IsNode.CategoryId): ZenithEncodedScanFormula.BooleanSingleFieldTupleNodeType {
                switch (categoryId) {
                    case ScanFormula.IsNode.CategoryId.Index: return ZenithEncodedScanFormula.IsIndexTupleNodeType;
                    default:
                        throw new UnreachableCaseError('SFZEEIN50502', categoryId);
                }
            }

            export function tryTupleNodeTypeToId(tupleNodeType: ZenithEncodedScanFormula.BooleanSingleFieldTupleNodeType): ScanFormula.IsNode.CategoryId | undefined {
                switch (tupleNodeType) {
                    case ZenithEncodedScanFormula.IsIndexTupleNodeType: return ScanFormula.IsNode.CategoryId.Index;
                    default: {
                        const ignoredValue: never = tupleNodeType;
                        return undefined;
                    }
                }
            }
        }
    }

    export namespace PriceSubField {
        export function toId(value: ZenithEncodedScanFormula.PriceSubFieldEnum): ScanFormula.PriceSubFieldId {
            const fieldId = tryDecodeId(value);
            if (fieldId === undefined) {
                throw new AssertInternalError('ZSCCPSFTI16179', value);
            } else {
                return fieldId;
            }
        }

        export function tryDecodeId(value: ZenithEncodedScanFormula.PriceSubFieldEnum): ScanFormula.PriceSubFieldId | undefined {
            switch (value) {
                case ZenithEncodedScanFormula.PriceSubFieldEnum.LastPrice: return ScanFormula.PriceSubFieldId.Last;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function encodeId(value: ScanFormula.PriceSubFieldId): ZenithEncodedScanFormula.PriceSubFieldEnum {
            switch (value) {
                case ScanFormula.PriceSubFieldId.Last: return ZenithEncodedScanFormula.PriceSubFieldEnum.LastPrice;
                default:
                    throw new UnreachableCaseError('ZSCCPSFFI16179', value);
            }
        }
    }

    export namespace DateSubField {
        export function toId(value: ZenithEncodedScanFormula.DateSubFieldEnum): ScanFormula.DateSubFieldId {
            const fieldId = tryDecodeId(value);
            if (fieldId === undefined) {
                throw new AssertInternalError('ZSCCDSFTI16179', value);
            } else {
                return fieldId;
            }
        }

        export function tryDecodeId(value: ZenithEncodedScanFormula.DateSubFieldEnum): ScanFormula.DateSubFieldId | undefined {
            switch (value) {
                case ZenithEncodedScanFormula.DateSubFieldEnum.Dividend: return ScanFormula.DateSubFieldId.Dividend;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function encodeId(value: ScanFormula.DateSubFieldId): ZenithEncodedScanFormula.DateSubFieldEnum {
            switch (value) {
                case ScanFormula.DateSubFieldId.Dividend: return ZenithEncodedScanFormula.DateSubFieldEnum.Dividend;
                default:
                    throw new UnreachableCaseError('ZSCCDSFFI16179', value);
            }
        }
    }

    export namespace AltCodeSubField {
        export function toId(value: ZenithProtocolCommon.Symbol.KnownAlternateKey): ScanFormula.AltCodeSubFieldId {
            const fieldId = tryDecodeId(value);
            if (fieldId === undefined) {
                throw new AssertInternalError('ZSCCACSFTI16179', value);
            } else {
                return fieldId;
            }
        }

        export function tryDecodeId(value: ZenithProtocolCommon.Symbol.KnownAlternateKey): ScanFormula.AltCodeSubFieldId | undefined {
            switch (value) {
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.Ticker: return ScanFormula.AltCodeSubFieldId.Ticker;
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.ISIN: return ScanFormula.AltCodeSubFieldId.Isin;
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.Base: return ScanFormula.AltCodeSubFieldId.Base;
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.GICS: return ScanFormula.AltCodeSubFieldId.Gics;
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.RIC: return ScanFormula.AltCodeSubFieldId.Ric;
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.Short: return ScanFormula.AltCodeSubFieldId.Short;
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.Long: return ScanFormula.AltCodeSubFieldId.Long;
                case ZenithProtocolCommon.Symbol.KnownAlternateKey.UID: return ScanFormula.AltCodeSubFieldId.Uid;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function encodeId(value: ScanFormula.AltCodeSubFieldId): ZenithProtocolCommon.Symbol.KnownAlternateKey {
            switch (value) {
                case ScanFormula.AltCodeSubFieldId.Ticker: return ZenithProtocolCommon.Symbol.KnownAlternateKey.Ticker;
                case ScanFormula.AltCodeSubFieldId.Isin: return ZenithProtocolCommon.Symbol.KnownAlternateKey.ISIN;
                case ScanFormula.AltCodeSubFieldId.Base: return ZenithProtocolCommon.Symbol.KnownAlternateKey.Base;
                case ScanFormula.AltCodeSubFieldId.Gics: return ZenithProtocolCommon.Symbol.KnownAlternateKey.GICS;
                case ScanFormula.AltCodeSubFieldId.Ric: return ZenithProtocolCommon.Symbol.KnownAlternateKey.RIC;
                case ScanFormula.AltCodeSubFieldId.Short: return ZenithProtocolCommon.Symbol.KnownAlternateKey.Short;
                case ScanFormula.AltCodeSubFieldId.Long: return ZenithProtocolCommon.Symbol.KnownAlternateKey.Long;
                case ScanFormula.AltCodeSubFieldId.Uid: return ZenithProtocolCommon.Symbol.KnownAlternateKey.UID;
                default:
                    throw new UnreachableCaseError('ZSCCACSFFI16179', value);
            }
        }
    }

    export namespace AttributeSubField {
        export function toId(value: ZenithProtocolCommon.Symbol.KnownAttributeKey): ScanFormula.AttributeSubFieldId {
            const fieldId = tryDecodeId(value);
            if (fieldId === undefined) {
                throw new AssertInternalError('ZSCCATSFTI16179', value);
            } else {
                return fieldId;
            }
        }

        export function tryDecodeId(value: ZenithProtocolCommon.Symbol.KnownAttributeKey): ScanFormula.AttributeSubFieldId | undefined {
            switch (value) {
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.Category: return ScanFormula.AttributeSubFieldId.Category;
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.Class: return ScanFormula.AttributeSubFieldId.Class;
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.Delivery: return ScanFormula.AttributeSubFieldId.Delivery;
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.Sector: return ScanFormula.AttributeSubFieldId.Sector;
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.Short: return ScanFormula.AttributeSubFieldId.Short;
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.ShortSuspended: return ScanFormula.AttributeSubFieldId.ShortSuspended;
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.SubSector: return ScanFormula.AttributeSubFieldId.SubSector;
                case ZenithProtocolCommon.Symbol.KnownAttributeKey.MaxRss: return ScanFormula.AttributeSubFieldId.MaxRss;
                default: {
                    const neverValueIgnored: never = value;
                    return undefined;
                }
            }
        }

        export function encodeId(value: ScanFormula.AttributeSubFieldId): ZenithProtocolCommon.Symbol.KnownAttributeKey {
            switch (value) {
                case ScanFormula.AttributeSubFieldId.Category: return ZenithProtocolCommon.Symbol.KnownAttributeKey.Category;
                case ScanFormula.AttributeSubFieldId.Class: return ZenithProtocolCommon.Symbol.KnownAttributeKey.Class;
                case ScanFormula.AttributeSubFieldId.Delivery: return ZenithProtocolCommon.Symbol.KnownAttributeKey.Delivery;
                case ScanFormula.AttributeSubFieldId.Sector: return ZenithProtocolCommon.Symbol.KnownAttributeKey.Sector;
                case ScanFormula.AttributeSubFieldId.Short: return ZenithProtocolCommon.Symbol.KnownAttributeKey.Short;
                case ScanFormula.AttributeSubFieldId.ShortSuspended: return ZenithProtocolCommon.Symbol.KnownAttributeKey.ShortSuspended;
                case ScanFormula.AttributeSubFieldId.SubSector: return ZenithProtocolCommon.Symbol.KnownAttributeKey.SubSector;
                case ScanFormula.AttributeSubFieldId.MaxRss: return ZenithProtocolCommon.Symbol.KnownAttributeKey.MaxRss;
                default:
                    throw new UnreachableCaseError('ZSCCATSFFI16179', value);
            }
        }
    }

    export namespace DateValue {
        export function encodeDate(value: SourceTzOffsetDate): ZenithEncodedScanFormula.DateString {
            return ZenithConvert.Date.DashedYyyyMmDdDate.fromSourceTzOffsetDate(value);
        }

        export function tryDecodeDate(value: ZenithEncodedScanFormula.DateString): SourceTzOffsetDate | undefined {
            return ZenithConvert.Date.DashedYyyyMmDdDate.toSourceTzOffsetDate(value);
        }
    }

    export namespace TextContainsAs {
        export function encodeId(value: ScanFormula.TextContainsAsId): ZenithEncodedScanFormula.TextContainsAsEnum {
            switch (value) {
                case ScanFormula.TextContainsAsId.None: return ZenithEncodedScanFormula.TextContainsAsEnum.None;
                case ScanFormula.TextContainsAsId.FromStart: return ZenithEncodedScanFormula.TextContainsAsEnum.FromStart;
                case ScanFormula.TextContainsAsId.FromEnd: return ZenithEncodedScanFormula.TextContainsAsEnum.FromEnd;
                case ScanFormula.TextContainsAsId.Exact: return ZenithEncodedScanFormula.TextContainsAsEnum.Exact;
                default:
                    throw new UnreachableCaseError('ZSCCTCAFI51423', value);
            }
        }

        export function tryDecodeId(value: ZenithEncodedScanFormula.TextContainsAsEnum): ScanFormula.TextContainsAsId | undefined {
            switch (value) {
                case ZenithEncodedScanFormula.TextContainsAsEnum.None: return ScanFormula.TextContainsAsId.None;
                case ZenithEncodedScanFormula.TextContainsAsEnum.FromStart: return ScanFormula.TextContainsAsId.FromStart;
                case ZenithEncodedScanFormula.TextContainsAsEnum.FromEnd: return ScanFormula.TextContainsAsId.FromEnd;
                case ZenithEncodedScanFormula.TextContainsAsEnum.Exact: return ScanFormula.TextContainsAsId.Exact;
                default:
                    return undefined;
            }
        }
    }

    export const enum ErrorId {
        InvalidJson, // Set externally
        BooleanTupleNodeIsNotAnArray,
        BooleanTupleNodeArrayIsZeroLength,
        BooleanTupleNodeTypeIsNotString,
        UnknownField,
        SingleOperandLogicalBooleanDoesNotHaveOneOperand,
        LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands,
        MultiOperandLogicalBooleanMissingOperands,
        MultipleMatchingTupleNodeMissingParameters,
        TextMultipleMatchingTupleNodeParameterIsNotString,
        NumericComparisonDoesNotHave2Operands,
        NumericParameterIsNotNumberOrComparableFieldOrArray,
        UnexpectedBooleanParamType,
        UnknownFieldBooleanParam,
        FieldBooleanParamCannotBeSubbedField,
        SubFieldIsNotString,
        PriceSubFieldHasValueSubFieldIsUnknown,
        DateSubFieldHasValueSubFieldIsUnknown,
        AltCodeSubFieldHasValueSubFieldIsUnknown,
        AttributeSubFieldHasValueSubFieldIsUnknown,
        TargetIsNotNumber,
        RangeMinIsDefinedButNotNumber,
        RangeMaxIsDefinedButNotNumber,
        RangeMinAndMaxAreBothUndefined,
        DateFieldEqualsTargetIsNotString,
        TextSubFieldIsMissing,
        TextFieldContainsValueIsNotString,
        TextFieldContainsAsIsNotString,
        TextFieldContainsAsHasInvalidFormat,
        TextFieldContainsAsIsNotBoolean,
        SingleFieldMustHaveOneParameter,
        PriceSubFieldEqualsSubFieldIsUnknown,
        DateSubFieldEqualsSubFieldIsUnknown,
        DateSubFieldEqualsTargetIsNotString,
        AltCodeSubFieldContainsSubFieldIsUnknown,
        AttributeSubFieldContainsSubFieldIsUnknown,
        TargetHasInvalidDateFormat,
        RangeSubFieldIsMissing,
        RangeMinIsDefinedButNotString,
        RangeMinHasInvalidDateFormat,
        RangeMaxIsDefinedButNotString,
        RangeMaxHasInvalidDateFormat,
        NamedParametersCannotBeNull,
        RangeFieldBooleanTupleNodeHasTooManyParameters,
        IsBooleanTupleNodeParameterIsNotBoolean,
        IsBooleanTupleNodeHasTooManyParameters,
        NumericTupleNodeIsZeroLength,
        NumericTupleNodeTypeIsNotString,
        NumericTupleNodeRequires2Or3Parameters,
        UnaryArithmeticNumericTupleNodeRequires2Parameters,
        LeftRightArithmeticNumericTupleNodeRequires3Parameters,
        UnknownBooleanTupleNodeType,
        UnknownNumericTupleNodeType,
        UnknownNumericField,
        FieldBooleanParamMustBeRangeOrExistsSingle,
        NumericRangeFirstParameterMustBeNumberOrNamed,
        DateRangeFirstParameterMustBeStringOrNamed,
        TextFieldMustHaveAtLeastOneParameter,
        TextRangeSecondParameterMustBeStringOrNamed,
        ExistsSingleFieldMustNotHaveMoreThan1Parameter,
        SingleFieldParameterIsNotString,
        TextFieldBooleanTupleNodeHasTooManyParameters,
        UnknownCurrency,
        IfTupleNodeRequiresAtLeast4Parameters,
        IfTupleNodeRequiresAnEvenNumberOfParameters,
        UnknownExchange,
        UnknownMarket,
        UnknownMarketBoard,
    }

    export namespace Error {
        export type Id = ErrorId;

        interface Info {
            readonly id: Id;
            readonly summaryId: StringId;
        }

        type InfosObject = { [id in keyof typeof ErrorId]: Info };
        const infosObject: InfosObject = {
            InvalidJson: {
                id: ErrorId.InvalidJson,
                summaryId: StringId.ScanFormulaZenithEncodingError_InvalidJson,
            },
            BooleanTupleNodeIsNotAnArray: {
                id: ErrorId.BooleanTupleNodeIsNotAnArray,
                summaryId: StringId.ScanFormulaZenithEncodingError_BooleanTupleNodeIsNotAnArray,
            },
            BooleanTupleNodeArrayIsZeroLength: {
                id: ErrorId.BooleanTupleNodeArrayIsZeroLength,
                summaryId: StringId.ScanFormulaZenithEncodingError_BooleanTupleNodeArrayIsZeroLength
            },
            BooleanTupleNodeTypeIsNotString: {
                id: ErrorId.BooleanTupleNodeTypeIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_BooleanTupleNodeTypeIsNotString
            },
            UnknownField: {
                id: ErrorId.UnknownField,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownField
            },
            SingleOperandLogicalBooleanDoesNotHaveOneOperand: {
                id: ErrorId.SingleOperandLogicalBooleanDoesNotHaveOneOperand,
                summaryId: StringId.ScanFormulaZenithEncodingError_SingleOperandLogicalBooleanDoesNotHaveOneOperand
            },
            LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands: {
                id: ErrorId.LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands,
                summaryId: StringId.ScanFormulaZenithEncodingError_LeftRightOperandLogicalBooleanDoesNotHaveTwoOperands
            },
            MultiOperandLogicalBooleanMissingOperands: {
                id: ErrorId.MultiOperandLogicalBooleanMissingOperands,
                summaryId: StringId.ScanFormulaZenithEncodingError_MultiOperandLogicalBooleanMissingOperands
            },
            MultipleMatchingTupleNodeMissingParameters: {
                id: ErrorId.MultipleMatchingTupleNodeMissingParameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_MultipleMatchingTupleNodeMissingParameters,
            },
            TextMultipleMatchingTupleNodeParameterIsNotString: {
                id: ErrorId.TextMultipleMatchingTupleNodeParameterIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextMultipleMatchingTupleNodeParameterIsNotString,
            },
            NumericComparisonDoesNotHave2Operands: {
                id: ErrorId.NumericComparisonDoesNotHave2Operands,
                summaryId: StringId.ScanFormulaZenithEncodingError_NumericComparisonDoesNotHave2Operands
            },
            NumericParameterIsNotNumberOrComparableFieldOrArray: {
                id: ErrorId.NumericParameterIsNotNumberOrComparableFieldOrArray,
                summaryId: StringId.ScanFormulaZenithEncodingError_NumericParameterIsNotNumberOrComparableFieldOrArray
            },
            UnexpectedBooleanParamType: {
                id: ErrorId.UnexpectedBooleanParamType,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnexpectedBooleanParamType
            },
            UnknownFieldBooleanParam: {
                id: ErrorId.UnknownFieldBooleanParam,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownFieldBooleanParam
            },
            FieldBooleanParamCannotBeSubbedField: {
                id: ErrorId.FieldBooleanParamCannotBeSubbedField,
                summaryId: StringId.ScanFormulaZenithEncodingError_FieldBooleanParamCannotBeSubbedField
            },
            SubFieldIsNotString: {
                id: ErrorId.SubFieldIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_SubFieldIsNotString
            },
            PriceSubFieldHasValueSubFieldIsUnknown: {
                id: ErrorId.PriceSubFieldHasValueSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_PriceSubFieldHasValueSubFieldIsUnknown
            },
            DateSubFieldHasValueSubFieldIsUnknown: {
                id: ErrorId.DateSubFieldHasValueSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_DateSubFieldHasValueSubFieldIsUnknown
            },
            AltCodeSubFieldHasValueSubFieldIsUnknown: {
                id: ErrorId.AltCodeSubFieldHasValueSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_AltCodeSubFieldHasValueSubFieldIsUnknown
            },
            AttributeSubFieldHasValueSubFieldIsUnknown: {
                id: ErrorId.AttributeSubFieldHasValueSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_AttributeSubFieldHasValueSubFieldIsUnknown
            },
            TargetIsNotNumber: {
                id: ErrorId.TargetIsNotNumber,
                summaryId: StringId.ScanFormulaZenithEncodingError_TargetIsNotNumber
            },
            RangeMinIsDefinedButNotNumber: {
                id: ErrorId.RangeMinIsDefinedButNotNumber,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotNumber
            },
            RangeMaxIsDefinedButNotNumber: {
                id: ErrorId.RangeMaxIsDefinedButNotNumber,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotNumber
            },
            RangeMinAndMaxAreBothUndefined: {
                id: ErrorId.RangeMinAndMaxAreBothUndefined,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeMinAndMaxAreBothUndefined
            },
            DateFieldEqualsTargetIsNotString: {
                id: ErrorId.DateFieldEqualsTargetIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_DateFieldEqualsTargetIsNotString
            },
            TextSubFieldIsMissing: {
                id: ErrorId.TextSubFieldIsMissing,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextSubFieldIsMissing
            },
            TextFieldContainsValueIsNotString: {
                id: ErrorId.TextFieldContainsValueIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextFieldContainsValueIsNotString
            },
            TextFieldContainsAsIsNotString: {
                id: ErrorId.TextFieldContainsAsIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotString
            },
            TextFieldContainsAsHasInvalidFormat: {
                id: ErrorId.TextFieldContainsAsHasInvalidFormat,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextFieldContainsAsHasInvalidFormat
            },
            TextFieldContainsAsIsNotBoolean: {
                id: ErrorId.TextFieldContainsAsIsNotBoolean,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextFieldContainsAsIsNotBoolean
            },
            SingleFieldMustHaveOneParameter: {
                id: ErrorId.SingleFieldMustHaveOneParameter,
                summaryId: StringId.ScanFormulaZenithEncodingError_SingleFieldMustHaveOneParameter
            },
            PriceSubFieldEqualsSubFieldIsUnknown: {
                id: ErrorId.PriceSubFieldEqualsSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_PriceSubFieldEqualsSubFieldIsUnknown
            },
            DateSubFieldEqualsSubFieldIsUnknown: {
                id: ErrorId.DateSubFieldEqualsSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_DateSubFieldEqualsSubFieldIsUnknown
            },
            DateSubFieldEqualsTargetIsNotString: {
                id: ErrorId.DateSubFieldEqualsTargetIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_DateSubFieldEqualsTargetIsNotString
            },
            AltCodeSubFieldContainsSubFieldIsUnknown: {
                id: ErrorId.AltCodeSubFieldContainsSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_AltCodeSubFieldContainsSubFieldIsUnknown
            },
            AttributeSubFieldContainsSubFieldIsUnknown: {
                id: ErrorId.AttributeSubFieldContainsSubFieldIsUnknown,
                summaryId: StringId.ScanFormulaZenithEncodingError_AttributeSubFieldContainsSubFieldIsUnknown
            },
            TargetHasInvalidDateFormat: {
                id: ErrorId.TargetHasInvalidDateFormat,
                summaryId: StringId.ScanFormulaZenithEncodingError_TargetHasInvalidDateFormat
            },
            RangeSubFieldIsMissing: {
                id: ErrorId.RangeSubFieldIsMissing,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeSubFieldIsMissing
            },
            RangeMinIsDefinedButNotString: {
                id: ErrorId.RangeMinIsDefinedButNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeMinIsDefinedButNotString
            },
            RangeMinHasInvalidDateFormat: {
                id: ErrorId.RangeMinHasInvalidDateFormat,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeMinHasInvalidDateFormat
            },
            RangeMaxIsDefinedButNotString: {
                id: ErrorId.RangeMaxIsDefinedButNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeMaxIsDefinedButNotString
            },
            RangeMaxHasInvalidDateFormat: {
                id: ErrorId.RangeMaxHasInvalidDateFormat,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeMaxHasInvalidDateFormat
            },
            NamedParametersCannotBeNull: {
                id: ErrorId.NamedParametersCannotBeNull,
                summaryId: StringId.ScanFormulaZenithEncodingError_NamedParametersCannotBeNull
            },
            RangeFieldBooleanTupleNodeHasTooManyParameters: {
                id: ErrorId.RangeFieldBooleanTupleNodeHasTooManyParameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_RangeFieldBooleanTupleNodeHasTooManyParameters
            },
            IsBooleanTupleNodeParameterIsNotBoolean: {
                id: ErrorId.IsBooleanTupleNodeParameterIsNotBoolean,
                summaryId: StringId.ScanFormulaZenithEncodingError_IsBooleanTupleNodeParameterIsNotBoolean,
            },
            IsBooleanTupleNodeHasTooManyParameters: {
                id: ErrorId.IsBooleanTupleNodeHasTooManyParameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_IsBooleanTupleNodeHasTooManyParameters,
            },
            NumericTupleNodeIsZeroLength: {
                id: ErrorId.NumericTupleNodeIsZeroLength,
                summaryId: StringId.ScanFormulaZenithEncodingError_NumericTupleNodeIsZeroLength
            },
            NumericTupleNodeTypeIsNotString: {
                id: ErrorId.NumericTupleNodeTypeIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_NumericTupleNodeTypeIsNotString
            },
            NumericTupleNodeRequires2Or3Parameters: {
                id: ErrorId.NumericTupleNodeRequires2Or3Parameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_NumericTupleNodeRequires2Or3Parameters
            },
            UnaryArithmeticNumericTupleNodeRequires2Parameters: {
                id: ErrorId.UnaryArithmeticNumericTupleNodeRequires2Parameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnaryArithmeticNumericTupleNodeRequires2Parameters
            },
            LeftRightArithmeticNumericTupleNodeRequires3Parameters: {
                id: ErrorId.LeftRightArithmeticNumericTupleNodeRequires3Parameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_LeftRightArithmeticNumericTupleNodeRequires3Parameters
            },
            UnknownBooleanTupleNodeType: {
                id: ErrorId.UnknownBooleanTupleNodeType,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownBooleanTupleNodeType
            },
            UnknownNumericTupleNodeType: {
                id: ErrorId.UnknownNumericTupleNodeType,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownNumericTupleNodeType
            },
            UnknownNumericField: {
                id: ErrorId.UnknownNumericField,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownNumericField
            },
            FieldBooleanParamMustBeRangeOrExistsSingle: {
                id: ErrorId.FieldBooleanParamMustBeRangeOrExistsSingle,
                summaryId: StringId.ScanFormulaZenithEncodingError_FieldBooleanParamMustBeRangeOrExistsSingle
            },
            NumericRangeFirstParameterMustBeNumberOrNamed: {
                id: ErrorId.NumericRangeFirstParameterMustBeNumberOrNamed,
                summaryId: StringId.ScanFormulaZenithEncodingError_NumericRangeFirstParameterMustBeNumberOrNamed
            },
            DateRangeFirstParameterMustBeStringOrNamed: {
                id: ErrorId.DateRangeFirstParameterMustBeStringOrNamed,
                summaryId: StringId.ScanFormulaZenithEncodingError_DateRangeFirstParameterMustBeStringOrNamed
            },
            TextFieldMustHaveAtLeastOneParameter: {
                id: ErrorId.TextFieldMustHaveAtLeastOneParameter,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextFieldMustHaveAtLeastOneParameter
            },
            TextRangeSecondParameterMustBeStringOrNamed: {
                id: ErrorId.TextRangeSecondParameterMustBeStringOrNamed,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextRangeSecondParameterMustBeStringOrNamed
            },
            ExistsSingleFieldMustNotHaveMoreThan1Parameter: {
                id: ErrorId.ExistsSingleFieldMustNotHaveMoreThan1Parameter,
                summaryId: StringId.ScanFormulaZenithEncodingError_ExistsSingleFieldMustNotHaveMoreThan1Parameter
            },
            SingleFieldParameterIsNotString: {
                id: ErrorId.SingleFieldParameterIsNotString,
                summaryId: StringId.ScanFormulaZenithEncodingError_SingleFieldParameterIsNotString
            },
            TextFieldBooleanTupleNodeHasTooManyParameters: {
                id: ErrorId.TextFieldBooleanTupleNodeHasTooManyParameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_TextFieldBooleanTupleNodeHasTooManyParameters
            },
            UnknownCurrency: {
                id: ErrorId.UnknownCurrency,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownCurrency
            },
            IfTupleNodeRequiresAtLeast4Parameters: {
                id: ErrorId.IfTupleNodeRequiresAtLeast4Parameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_IfTupleNodeRequiresAtLeast4Parameters
            },
            IfTupleNodeRequiresAnEvenNumberOfParameters: {
                id: ErrorId.IfTupleNodeRequiresAnEvenNumberOfParameters,
                summaryId: StringId.ScanFormulaZenithEncodingError_IfTupleNodeRequiresAnEvenNumberOfParameters
            },
            UnknownExchange: {
                id: ErrorId.UnknownExchange,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownExchange,
            },
            UnknownMarket: {
                id: ErrorId.UnknownMarket,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownMarket,
            },
            UnknownMarketBoard: {
                id: ErrorId.UnknownMarketBoard,
                summaryId: StringId.ScanFormulaZenithEncodingError_UnknownMarketBoard,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as Id) {
                    throw new EnumInfoOutOfOrderError('ScanFormulaZenithEncoding.Error', id, Strings[infos[id].summaryId]);
                }
            }
        }

        export function idToSummaryId(id: Id) {
            return infos[id].summaryId;
        }

        export function idToSummary(id: Id) {
            return Strings[idToSummaryId(id)];
        }
    }

    export function createDecodeErrorResult<T>(errorId: ScanFormulaZenithEncodingService.ErrorId, extraErrorText: string | undefined): Err<T, ScanFormulaZenithEncodingService.DecodeError> {
        const decodeError: ScanFormulaZenithEncodingService.DecodeError = {
            errorId,
            extraErrorText
        };
        return new Err(decodeError);
    }
}

export namespace ScanFormulaZenithEncodingModule {
    export function initialiseStatic() {
        ScanFormulaZenithEncodingService.Error.initialise();
    }
}
