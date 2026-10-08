import { lookAt, moveCard, multipleContext, takeHonor } from '../../GameActions/GameActions.js';
import { Location, ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/random.js';

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
            .chatText('reveal a random card from {1}\'s hand and place it on top of {1}\'s deck', (context) => (context.player.opponent ? [context.player.opponent] : []))
            .mayResolveAgain({
                cost: takeHonor((context) => ({ target: context.player })),
                label: 'Give 1 honor',
                condition: (context) => !!context.game.currentConflict?.getCharacters(context.player).some((card) => card.hasTrait('courtier'))
            });
    }
}
