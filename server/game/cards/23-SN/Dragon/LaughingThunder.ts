import type BaseCard from '../../../BaseCard.js';
import { CardType, Duration, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import { cannotTriggerAbilities, changeType, gainAllAbilitiesDynamic } from '../../../effects.js';
import { attach, cardLastingEffect, sequentialContext } from '../../../GameActions/GameActions.js';

export default class LaughingThunder extends DrawCard {
    static id = 'laughing-thunder';

    setupCardAbilities() {
        this.persistentEffect({
            effect: gainAllAbilitiesDynamic(
                (card) => {
                    return card.attachments.filter((a) => a.hasTrait('kiho') && a.printedType === CardType.Event);
                },
                true
            )
        });

        this.action('Attach a kiho to this character')
            .target({
                cardType: CardType.Event,
                controller: Players.Self,
                location: Location.Hand,
                cardCondition: (card, context) => card.hasTrait('kiho') &&
                    attach({ attachment: this.getDummyAttachment(card) }).canAffect(context.source, context)
            })
            .gameAction(sequentialContext((context) => {
                const gameActions: GameAction[] = [];

                gameActions.push(cardLastingEffect({
                    target: context.target,
                    duration: Duration.Custom,
                    targetLocation: Location.Any,
                    canChangeZoneOnce: true,
                    until: {
                        onCardDetached: event => event.card === context.target,
                        onCardLeavesPlay: event => event.card === context.target
                    },
                    effect: [
                        cannotTriggerAbilities(),
                        changeType(CardType.Attachment)
                    ]
                }));

                gameActions.push(attach({
                    attachment: context.target,
                    target: context.source
                }));

                return { gameActions };
            }))
            .effect('claim the effects of {0} as its own');
    }


    getDummyAttachment(card: BaseCard) {
        const DummyKihoAttachment = new DrawCard(this.owner, {
            cost: '0',
            glory: '0',
            side: 'conflict',
            text: '',
            type: CardType.Attachment,
            name: 'Kiho',
            id: card.id,
            traits: ['kiho']
        });

        return DummyKihoAttachment;
    }

}
