import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, ConflictType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class TheVoidOfWar extends DrawCard {
    static id = 'the-void-of-war';

    setupCardAbilities() {
        this.action('Each player bows an opponent character until refused')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                controller: Players.Opponent,
                player: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.bow())
            .effect('bow {0}')
            .then((context) => {
                return {
                    target: {
                        player: context.player.opponent ? Players.Opponent : Players.Self,
                        mode: TargetMode.Select,
                        activePromptTitle: 'Resolve The Void of War\'s ability again?',
                        choices: {
                            Yes: AbilityDsl.actions.resolveAbility({
                                ability: context.ability,
                                player: context.player.opponent ?? context.player,
                                subResolution: true,
                                choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
                            }),
                            No: () => true
                        }
                    },
                    message: '{3} chooses {4}to resolve {1}\'s ability again',
                    messageArgs: (thenContext: AbilityContext) => [
                        context.player.opponent ?? context.player,
                        thenContext.select === 'No' ? 'not ' : ''
                    ]
                };
            });
    }
}
