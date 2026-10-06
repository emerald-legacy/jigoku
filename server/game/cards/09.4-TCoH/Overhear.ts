import { lookAt, moveCard, multipleContext, resolveAbility, takeHonor } from '../../GameActions/GameActions.js';
import { Location, TargetMode, ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/shuffle.js';

export default class Overhear extends DrawCard {
    static id = 'overhear';

    public setupCardAbilities() {
        this.action('Place random card on top of deck')
            .condition((context) => context.game.isDuringConflict(ConflictType.Political) && context.player.opponent !== undefined)
            .gameAction(multipleContext((context) => {
                const card = context.player.opponent ? shuffle(context.player.opponent.hand).slice(0, 1) : [];
                return {
                    gameActions: [
                        lookAt(() => ({
                            target: card,
                            message: '{0} sees {1}',
                            messageArgs: (cards) => [context.player, cards]
                        })),
                        moveCard(() => ({
                            target: card,
                            destination: Location.ConflictDeck
                        }))
                    ]
                };
            }))
            .effect('reveal a random card from {1}\'s hand and place it on top of {1}\'s deck', (context) => (context.player.opponent ? [context.player.opponent] : []))
            .then((context) => {
                if(!context.game.currentConflict) {
                    return {};
                }
                if(
                    context.game.currentConflict
                        .getCharacters(context.player)
                        .filter((card) => card.hasTrait('courtier')).length < 1
                ) {
                    return {};
                }
                if(context.subResolution) {
                    return {
                        target: {
                            mode: TargetMode.Select,
                            choices: {
                                'Give 1 honor for no effect': takeHonor({ target: context.player }),
                                Done: () => true
                            }
                        },
                        message: '{0} chooses {3}to give an honor to {4} for no effect',
                        messageArgs: (innerContext) => [
                            innerContext.select === 'Done' ? 'not ' : '',
                            innerContext.player.opponent
                        ]
                    };
                }
                return {
                    target: {
                        mode: TargetMode.Select,
                        choices: {
                            'Give 1 honor to resolve this ability again': takeHonor({
                                target: context.player
                            }),
                            Done: () => true
                        }
                    },
                    message: '{0} chooses {3}to give an honor to {4} to resolve {1} again',
                    messageArgs: (innerContext) => [
                        innerContext.select === 'Done' ? 'not ' : '',
                        innerContext.player.opponent
                    ],
                    then: {
                        gameAction: resolveAbility({
                            ability: context.ability,
                            subResolution: true,
                            choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
                        })
                    }
                };
            });
    }
}
