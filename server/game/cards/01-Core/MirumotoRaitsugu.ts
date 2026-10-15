import { CardType, DuelType, Players } from '../../Constants.js';
import { conditional, discardFromPlay, duel, removeFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MirumotoRaitsugu extends DrawCard {
    static id = 'mirumoto-raitsugu';

    setupCardAbilities() {
        this.action('Duel an opposing character')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, duel({
                type: DuelType.Military,
                gameAction: (duel) =>
                    conditional({
                        target: duel.loser?.[0],
                        condition: (duel.loser?.[0]?.getFate() ?? 0) > 0,
                        trueGameAction: removeFate(),
                        falseGameAction: discardFromPlay()
                    })
            }));
    }
}
