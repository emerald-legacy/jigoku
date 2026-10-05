import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Decks } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { attachSearchedCard } from '../../attachSearchedCard.js';

export default class KakitaMio extends DrawCard {
    static id = 'kakita-mio';

    setupCardAbilities() {
        this.reaction('Search for Writ of Sanctification')
            .when({ onCharacterEntersPlay: (event, context) => event.card === context.source })
            .gameAction(AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a Writ of Sanctification',
                deck: Decks.ConflictDeck,
                cardCondition: (card) => card.name === 'Writ of Sanctification',
                selectedCardsHandler: (context, _, [card]) =>
                    attachSearchedCard(context, context.source, card, '{0} receives their {1}', (card) => [context.source, card])
            }));

        this.action('Give Corrupt to a character')
            .condition((context) => context.game.currentConflict !== null)
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    context.game.currentConflict?.getNumberOfParticipantsFor(card.controller) === 1
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.addTrait('shadowlands')
            }));

        this.persistentEffect({
            condition: (context) =>
                !!context.game.currentConflict &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent, (card) => (card.hasTrait('shadowlands') || card.isTainted)) > 0,
            match: (card, context) =>
                card.type === CardType.Character &&
                !!context && card.isParticipatingFor(context.player) &&
                (card.hasTrait('imperial') || card.attachments.some((attachment) => attachment.hasTrait('imperial'))),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}
