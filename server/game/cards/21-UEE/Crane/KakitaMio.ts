import AbilityDsl from '../../../abilitydsl';
import { Conflict } from '../../../conflict';
import { CardTypes, Decks, Durations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class KakitaMio extends DrawCard {
    static id = 'kakita-mio';

    setupCardAbilities() {
        this.reaction({
            title: 'Search for Writ of Sanctification',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a Writ of Sanctification',
                deck: Decks.ConflictDeck,
                cardCondition: (card) => card.name === 'Writ of Sanctification',
                selectedCardsHandler: (context, _, [card]) => {
                    if (card == null) return;

                    context.game.addMessage('{0} receives their {1}', context.source, card);
                    context.game.queueSimpleStep(() =>
                        AbilityDsl.actions.attach({ target: context.source, attachment: card }).resolve(null, context)
                    );
                }
            })
        });

        this.action({
            title: 'Give Corrupt to a character',
            condition: (context) => context.game.currentConflict != null,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    context.game.currentConflict.getNumberOfParticipantsFor(card.controller) === 1,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.addTrait('shadowlands')
                })
            }
        });

        this.persistentEffect({
            condition: (context) =>
                context.game.currentConflict instanceof Conflict &&
                context.game.currentConflict.getNumberOfParticipants((card) => card.hasTrait('shadowlands')) > 0,
            match: (card, context) =>
                card.type === CardTypes.Character &&
                card.isParticipatingFor(context.player) &&
                (card.hasTrait('imperial') || card.attachments.some((attachment) => attachment.hasTrait('imperial'))),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}
