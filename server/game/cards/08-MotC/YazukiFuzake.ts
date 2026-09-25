import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class YasukiFuzake extends DrawCard {
    static id = 'yasuki-fuzake';

    setupCardAbilities() {
        this.interrupt('Discard the status token on up to two characters')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target('first', {
                optional: true,
                cardType: CardType.Character
            }, AbilityDsl.actions.discardStatusToken(context => ({
                target: Array.isArray(context.targets.first) ? [] : context.targets.first.statusTokens
            })))
            .target('second', {
                dependsOn: 'first',
                cardType: CardType.Character,
                optional: true,
                cardCondition: (card, context) => Array.isArray(context.targets.first) || card.controller !== context.targets.first.controller
            }, AbilityDsl.actions.discardStatusToken(context => ({
                target: Array.isArray(context.targets.second) ? [] : context.targets.second.statusTokens
            })))
            .effect('discard all status tokens from {1}{2}{3}', context => [context.targets.first, !Array.isArray(context.targets.second) ? ' and ' : '', context.targets.second]);
    }
}


export default YasukiFuzake;
