import { CardType, DuelType, Players, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
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
            }, AbilityDsl.actions.duel((context) => ({
                type: DuelType.Military,

                message: '{0} chooses whether to dishonor or bow {1}',
                messageArgs: (duel) => [
                    duel.winner?.includes(context.source) ? context.player.opponent : context.player,
                    duel.loser
                ],
                gameAction: (duel) => {
                    if(!duel.loser) {
                        return AbilityDsl.actions.noAction();
                    }
                    return AbilityDsl.actions.multiple(
                        duel.loser.map((card) =>
                            AbilityDsl.actions.chooseAction({
                                target: card,
                                player: context.player !== card.controller ? Players.Opponent : Players.Self,
                                options: {
                                    'Dishonor this character': {
                                        action: AbilityDsl.actions.dishonor(),
                                        message: '{0} chooses to dishonor {1}'
                                    },
                                    'Bow this character': {
                                        action: AbilityDsl.actions.bow(),
                                        message: '{0} chooses to bow {1}'
                                    }
                                }
                            })
                        )
                    );
                }
            })));
    }
}
