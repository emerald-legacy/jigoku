import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class ShosuroActor extends DrawCard {
    static id = 'shosuro-actor';

    setupCardAbilities() {
        this.action('Choose a character to copy')
            .condition((context) => context.source.isParticipating())
            .target('target', {
                player: Players.Self,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isUnique()
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source,
                effect: context.target ? AbilityDsl.effects.copyCard(context.target) : []
            })))
            .effect('become a copy of {1}', (context) => [context.target ?? '']);
    }
}
