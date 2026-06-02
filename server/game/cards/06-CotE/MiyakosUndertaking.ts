import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class MiyakosUndertaking extends DrawCard {
    static id = 'miyako-s-undertaking';

    setupCardAbilities() {
        this.action({
            title: 'Make a character a copy',

            targets: {
                cardToCopy: {
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    location: Location.DynastyDiscardPile,
                    cardCondition: (card) => !card.isUnique()
                },
                myCharacter: {
                    dependsOn: 'cardToCopy',
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.copyCard(context.targets.cardToCopy)
                    }))
                }
            },
            effect: 'make {1} into a copy of {2}',
            effectArgs: (context) => [context.targets.myCharacter, context.targets.cardToCopy]
        });
    }

    canPlay(context: TriggeredAbilityContext) {
        return context.player.honor <= 6 && super.canPlay(context);
    }
}
