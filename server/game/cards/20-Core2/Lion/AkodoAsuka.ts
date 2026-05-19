import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Locations } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

function getCharactersWithoutFate(context: AbilityContext) {
    return context.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0;
}

export default class AkodoAsuka extends DrawCard {
    static id = 'akodo-asuka';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.conflictDeck.length > 0
            },
            gameAction: AbilityDsl.actions.deckSearch({
                amount: (context) => getCharactersWithoutFate(context),
                activePromptTitle: 'Choose a card to put in your hand',
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                }),
                shuffle: true,
                reveal: false
            }),
            effect: 'look at the top {1} cards of their conflict deck',
            effectArgs: (context) => getCharactersWithoutFate(context)
        });
    }
}
