import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class ShosuroActor extends DrawCard {
    static id = 'shosuro-actor';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Choose a character to copy',
            condition: (context) => context.source.isParticipating(),
            target: {
                player: Players.Self,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isUnique(),
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    target: context.source,
                    effect: AbilityDsl.effects.copyCard(context.target)
                }))
            },
            effect: 'become a copy of {1}',
            effectArgs: (context) => [context.target ?? '']
        });
    }
}
