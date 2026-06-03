import { CardType, DuelType, Players, TargetMode } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class MirumotoHitomi extends DrawCard {
    static id = 'mirumoto-hitomi';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                mode: TargetMode.UpTo,
                numCards: 2,
                gameAction: AbilityDsl.actions.duel(((context: AbilityContext) => ({
                    type: DuelType.Military,
                    challenger: context.source,
                    message: '{0} chooses whether to dishonor or bow {1}',
                    messageArgs: (duel: any) => [
                        context.source === duel.winner ? context.player.opponent : context.player,
                        duel.loser
                    ],
                    gameAction: (duel: any) => {
                        if(!duel.loser) {
                            return undefined;
                        }
                        return AbilityDsl.actions.multiple(
                            ([] as any[]).concat(duel.loser).map((card: any) =>
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
                })) as any)
            }
        });
    }
}
