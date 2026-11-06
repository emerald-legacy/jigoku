import { CardType, DuelType, Players } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { ResolvedDuel } from '../../Duel.js';
import { duel, injure } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';

export default class MirumotoRaitsugu extends DrawCard {
    static id = 'mirumoto-raitsugu';

    override setupCardAbilities() {
        this.action('Duel an opposing character')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, duel({
                type: DuelType.Military,
                gameAction: (duel) => injure({ target: duel.loser ?? [] }),
                chatText: (context, duel) => this.injureMessage(context, duel)
            }));
    }

    private injureMessage(context: AbilityContext, duel: ResolvedDuel) {
        const losers = duel.loser ?? [];
        const injured = losers.filter((card) => injure({ target: losers }).canAffect(card, context));
        const discarded = injured.filter((card) => card.getFate() === 0);
        const fateRemoved = injured.filter((card) => card.getFate() > 0);
        const parts = [
            discarded.length > 0 ? context.game.gameChat.nested(msg`discard ${discarded}`) : undefined,
            fateRemoved.length > 0 ? context.game.gameChat.nested(msg`remove 1 fate from ${fateRemoved}`) : undefined
        ].filter((part) => part !== undefined);
        return msg`${parts}`;
    }
}
