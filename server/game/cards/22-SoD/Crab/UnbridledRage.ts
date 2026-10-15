import { Duration, DuelType, Players, Trait } from '../../../Constants.js';
import { additionalAction, cannotContribute } from '../../../effects.js';
import { cardLastingEffect, draw, multiple, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class UnbridledRage extends DrawCard {
    static id = 'unbridled-rage';

    override setupCardAbilities() {
        this.action('Military duel to stop contribution')
            .initiateDuel(() => ({
                type: DuelType.Military,
                challengerCondition: (card) => card.hasTrait(Trait.Berserker) && card.isParticipating(),
                chatText: (_context, duel) => msg`prevent ${duel.loser?.[0]} from contributing to resolution of this conflict`,
                refuseGameAction: multiple([
                    draw((context) => ({
                        amount: 2,
                        target: context.player
                    })),
                    playerLastingEffect({
                        target: Players.Self,
                        duration: Duration.UntilPassPriority,
                        effect: additionalAction()
                    })
                ]),
                refusalMessage: (context, refuser) =>
                    msg`${refuser} chooses to refuse the duel, allowing ${context.player} to draw 2 cards and take an additional action`,
                gameAction: (duel) =>
                    cardLastingEffect({
                        target: duel.loser,
                        effect: [cannotContribute(() => (card) => (duel.loser ?? []).includes(card))]
                    })
            }));
    }
}
