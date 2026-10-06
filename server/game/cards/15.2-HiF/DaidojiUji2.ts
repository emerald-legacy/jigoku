import DrawCard from '../../DrawCard.js';
import { hideWhenFaceUp } from '../../effects.js';
import { deckSearch } from '../../GameActions/GameActions.js';
import { TargetMode, Decks } from '../../Constants.js';
import { playableFromUnderneath } from '../cardsUnderneath.js';

class DaidojiUji2 extends DrawCard {
    static id = 'daidoji-uji-2';

    setupCardAbilities() {
        this.reaction('Search your conflict deck')
            .when({ onCharacterEntersPlay: (event, context) => event.card === context.source })
            .gameAction(deckSearch({
                targetMode: TargetMode.UpTo,
                numCards: 4,
                deck: Decks.ConflictDeck,
                reveal: false,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1} cards', event.player, cards.length);
                        cards.forEach(card => {
                            context.player.moveCard(card, this.uuid);
                            card.controller = context.source.controller;
                            card.facedown = false;
                            card.lastingEffect(() => ({
                                until: {
                                    onCardMoved: event => event.card === card && event.originalLocation === this.uuid
                                },
                                match: card,
                                effect: [
                                    hideWhenFaceUp()
                                ]
                            }));
                        });
                    } else {
                        this.game.addMessage('{0} selects no cards', event.player);
                    }
                }
            }));

        this.persistentEffect({
            condition: context => context.source.isHonored,
            ...playableFromUnderneath(this)
        });
    }
}


export default DaidojiUji2;
