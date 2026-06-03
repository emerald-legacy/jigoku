import * as GameActions from '../GameActions/GameActions.js';
import { CardGameAction } from '../GameActions/CardGameAction.js';
import { SelectCardProperties } from '../GameActions/SelectCardAction.js';
import { MetaActionCost } from './MetaActionCost.js';

export type SelectCostProperties = Omit<SelectCardProperties, 'gameAction'>;

export function getSelectCost(
    action: CardGameAction,
    properties: undefined | SelectCostProperties,
    activePromptTitle: string
) {
    return new MetaActionCost(
        GameActions.selectCard(Object.assign({ gameAction: action }, properties)),
        activePromptTitle
    );
}
