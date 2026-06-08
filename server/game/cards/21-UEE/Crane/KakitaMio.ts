import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { Conflict } from '../../../Conflict.js';
import { CardType, Decks, Duration } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

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
                    if(card === null || card === undefined) {
                        return;
                    }

                    context.game.addMessage('{0} receives their {1}', context.source, card);
                    context.game.queueSimpleStep(() =>
                        AbilityDsl.actions.attach({ target: context.source, attachment: card }).resolve(undefined, context)
                    );
                }
            })
        });

        this.action({
            title: 'Give Corrupt to a character',
            condition: (context) => context.game.currentConflict !== null,
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    context.game.currentConflict?.getNumberOfParticipantsFor(card.controller) === 1,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Duration.UntilEndOfConflict,
                    effect: AbilityDsl.effects.addTrait('shadowlands')
                })
            }
        });

        this.persistentEffect({
            condition: (context) =>
                context.game.currentConflict instanceof Conflict &&
                context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent, (card) => (card.hasTrait('shadowlands') || card.isTainted)) > 0,
            match: (card: DrawCard, context) =>
                card.type === CardType.Character &&
                card.isParticipatingFor(context?.player as Player) &&
                (card.hasTrait('imperial') || card.attachments.some((attachment: BaseCard) => attachment.hasTrait('imperial'))),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });
    }
}
