import { msg } from '../../GameChat.js';
import { CardType, DuelType, Players, TargetMode } from '../../Constants.js';
import { bow, chooseAction, dishonor, duel, multiple, noAction } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MirumotoHitomi extends DrawCard {
    static id = 'mirumoto-hitomi';

    setupCardAbilities() {
        this.action('Initiate a military duel')
            .condition((context) => context.source.isParticipating())
            .targetCards({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                mode: TargetMode.UpTo,
                numCards: 2
            }, duel((context) => ({
                type: DuelType.Military,
                chatText: (_context, duel) => msg`${duel.winner?.includes(context.source) ? context.player.opponent : context.player} chooses whether to dishonor or bow ${duel.loser}`,
                gameAction: (duel) => {
                    if(!duel.loser) {
                        return noAction();
                    }
                    return multiple(
                        duel.loser.map((card) =>
                            chooseAction({
                                target: card,
                                player: context.player !== card.controller ? Players.Opponent : Players.Self,
                                options: {
                                    'Dishonor this character': {
                                        action: dishonor(),
                                        message: (_context, target, player) => msg`${player} chooses to dishonor ${target}`
                                    },
                                    'Bow this character': {
                                        action: bow(),
                                        message: (_context, target, player) => msg`${player} chooses to bow ${target}`
                                    }
                                }
                            })
                        )
                    );
                }
            })));
    }
}
