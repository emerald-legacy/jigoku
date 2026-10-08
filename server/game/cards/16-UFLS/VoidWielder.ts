import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import {
    discardFromPlay,
    discardStatusToken,
    selectCard,
    selectToken,
    sendHome
} from '../../GameActions/GameActions.js';
import { Element, CardType, Players } from '../../Constants.js';

const elementKey = 'void-wielder-void';

class VoidWielder extends DrawCard {
    static id = 'void-wielder';

    setupCardAbilities() {
        this.action('Wield the power of the void')
            .condition(() => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && sendHome().canAffect(card, context)
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: (context) => context.targets.character.controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Move this character home': sendHome((context) => ({ target: context.targets.character })),
                'Discard a status token from this character': selectToken((context) => ({
                    card: context.targets.character,
                    player: context.targets.character.controller === context.player ? Players.Self : Players.Opponent,
                    activePromptTitle: 'Which token do you wish to discard?',
                    message: '{0} discards {1}',
                    chatText: 'discard a status token from {0}',
                    chatTextArgs: () => [context.targets.character],
                    messageArgs: (token, player) => [player, token],
                    gameAction: discardStatusToken()
                })),
                'Discard an attachment from this character': selectCard((context) => ({
                    cardType: CardType.Attachment,
                    player: context.targets.character.controller === context.player ? Players.Self : Players.Opponent,
                    activePromptTitle: 'Which attachment do you wish to discard?',
                    cardCondition: (card, context) => card.parentCharacter === context.targets.character,
                    gameAction: discardFromPlay(),
                    chatText: 'discard an attachment from {0}',
                    chatTextArgs: () => [context.targets.character],
                    message: (_context, card, player) => msg`${player} discards ${card}`}))
            });
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Element.Void
        });
        return symbols;
    }
}


export default VoidWielder;
