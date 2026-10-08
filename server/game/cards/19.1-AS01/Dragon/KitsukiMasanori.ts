import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, DeckType, Duration } from '../../../Constants.js';
import { cardCannot } from '../../../effects.js';
import {
    attach,
    cardLastingEffect,
    cardMenu,
    chooseAction,
    deckSearch,
    sequential
} from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import { attachSearchedCard } from '../../attachSearchedCard.js';

const selectAttachmentPrompt = 'Select an attachment';

function isSearchableCard(card: BaseCard, context: AbilityContext) {
    return (
        card.type === CardType.Attachment &&
        (card.hasTrait('title') || card.hasTrait('technique')) &&
        card.canAttach(context.source)
    );
}

export default class KitsukiMasanori extends DrawCard {
    static id = 'kitsuki-masanori';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: cardCannot({ cannot: 'applyCovert', restricts: 'opponentsCardEffects' })
        });

        this.reaction('Search for a Title or Technique')
            .when({ onCharacterEntersPlay: (event, context) => event.card === context.source })
            .gameAction(sequential([
                chooseAction({
                    activePromptTitle: 'Select where to search',
                    options: {
                        'Search discard pile': {
                            action: cardMenu((context) => ({
                                activePromptTitle: selectAttachmentPrompt,
                                cards: context.player.conflictDiscardPile.filter((card) =>
                                    isSearchableCard(card, context)
                                ),
                                subActionProperties: (card) => ({
                                    attachment: card,
                                    target: context.source
                                }),
                                gameAction: attach(),
                                message: '{0} takes {1} and attaches it to {2}',
                                messageArgs: (card) => [context.source.controller, card, context.source]
                            })),
                            message: (_context, _target, player) => msg`${player} searches their discard pile`
                        },

                        'Search conflict deck': {
                            action: deckSearch({
                                activePromptTitle: selectAttachmentPrompt,
                                deck: DeckType.Conflict,
                                reveal: true,
                                cardCondition: (card, context) => isSearchableCard(card, context),
                                selectedCardsHandler: (context, event, [card]) =>
                                    attachSearchedCard(context, context.source, card, '{0} takes {1} and attaches it to {2}', (card) => [event.player, card, context.source])
                            }),
                            message: (_context, _target, player) => msg`${player} searches their conflict deck`
                        }
                    }
                }),
                cardLastingEffect((context) => {
                    const [fetchedAttachment] = context.source.attachments;
                    return {
                        target: fetchedAttachment,
                        condition: (context) => fetchedAttachment.parentCharacter === context.source,
                        duration: Duration.Custom,
                        effect: cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsCardAbilities',
                            applyingPlayer: context.player
                        })
                    };
                })
            ]))
            .chatText('search for a Technique or Title');
    }
}
