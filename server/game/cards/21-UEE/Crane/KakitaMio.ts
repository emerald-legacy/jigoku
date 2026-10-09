import { msg } from '../../../GameChat.js';
import { addTrait, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, DeckType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { attachSearchedCard } from '../../attachSearchedCard.js';

export default class KakitaMio extends DrawCard {
    static id = 'kakita-mio';

    setupCardAbilities() {
        this.reaction('Search for Writ of Sanctification')
            .when({ onCharacterEntersPlay: (event, context) => event.card === context.source })
            .deckSearch({
                activePromptTitle: 'Choose a Writ of Sanctification',
                deck: DeckType.Conflict,
                cardCondition: (card) => card.name === 'Writ of Sanctification',
                selectedCardsHandler: (context, _, [card]) =>
                    attachSearchedCard(context, context.source, card, (card) => msg`${context.source} receives their ${card}`)
            });

        this.conflictAction('Give Corrupt to a character', { evenFromHome: true })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    context.game.currentConflict?.getNumberOfParticipantsFor(card.controller) === 1
            }, cardLastingEffect({
                effect: addTrait('shadowlands')
            }));

        this.persistentEffect({
            condition: (context) =>
                !!context.game.currentConflict &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent, (card) => (card.hasTrait('shadowlands') || card.isTainted)) > 0,
            match: (card, context) =>
                card.type === CardType.Character &&
                !!context && card.isParticipatingFor(context.player) &&
                (card.hasTrait('imperial') || card.attachments.some((attachment) => attachment.hasTrait('imperial'))),
            effect: modifyBothSkills(1)
        });
    }
}
