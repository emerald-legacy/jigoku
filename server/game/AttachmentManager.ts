import { msg } from './GameChat.js';
import { CardType, EffectName } from './Constants.js';
import type { traitLimit } from './Interfaces.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';
import { discardFromPlay } from './GameActions/GameActions.js';

export class AttachmentManager {
    attachments: DrawCard[] = [];

    constructor(private readonly host: BaseCard) {}

    remove(attachment: DrawCard): void {
        this.attachments = this.attachments.filter((card) => card.uuid !== attachment.uuid);
    }

    hasCopyOf(attachment: DrawCard, controller: Player): boolean {
        return this.host.game.rules.attachmentsMaxOneCopyPerName && !attachment.allowDuplicatesOfAttachment &&
            this.attachments.some((other) => other !== attachment && isCopy(other, attachment) && other.controller === controller);
    }

    allowAttachment(attachment: DrawCard): boolean {
        if(this.host.allowedAttachmentTraits.some((trait) => attachment.getTraits().has(trait))) {
            return true;
        }
        return this.host.isBlank() || this.host.allowedAttachmentTraits.length === 0;
    }

    checkForIllegalAttachments(): boolean {
        const host = this.host;
        const game = host.game;
        const context = (game.getFrameworkContext)(host.controller);
        const illegalAttachments = new Set<DrawCard>(
            this.attachments.filter((attachment) => !host.allowAttachment(attachment) || !attachment.canAttach(host))
        );
        for(const effectCard of host.getEffects(EffectName.CannotHaveOtherRestrictedAttachments)) {
            for(const card of this.attachments) {
                if(card.isRestricted() && card !== effectCard) {
                    illegalAttachments.add(card);
                }
            }
        }

        const attachmentLimits = this.attachments.filter((card) => card.anyEffect(EffectName.AttachmentLimit));
        for(const card of attachmentLimits) {
            const limit = Math.max(...card.getEffects(EffectName.AttachmentLimit));
            const matchingAttachments = this.attachments.filter((attachment) => attachment.id === card.id);
            for(const overflow of matchingAttachments.slice(0, -limit)) {
                illegalAttachments.add(overflow);
            }
        }

        for(const object of this.attachments.reduce<Array<traitLimit>>(
            (array, card) => array.concat(card.getEffects(EffectName.AttachmentRestrictTraitAmount)),
            []
        )) {
            for(const [trait, limit] of Object.entries(object)) {
                if(limit === undefined) {
                    continue;
                }
                const matchingAttachments = this.attachments.filter((attachment) => attachment.getTraits().has(trait));
                for(const overflow of matchingAttachments.slice(0, -limit)) {
                    illegalAttachments.add(overflow);
                }
            }
        }
        const maximumRestricted = 2 + host.sumEffects(EffectName.ModifyRestrictedAttachmentAmount);
        if(this.attachments.filter((card) => card.isRestricted()).length > maximumRestricted) {
            game.promptForSelect(host.controller, {
                activePromptTitle: 'Choose an attachment to discard',
                waitingPromptTitle: 'Waiting for opponent to choose an attachment to discard',
                cardType: CardType.Attachment,
                cardCondition: (card) => card.parent?.uuid === host.uuid && card.isRestricted(),
                onSelect: (player: Player, card) => {
                    game.addMessage(msg`${player} discards ${card} from ${card.parent} due to too many Restricted attachments`);

                    if(illegalAttachments.size > 0) {
                        const plural = illegalAttachments.size > 1;
                        game.addMessage(msg`${Array.from(illegalAttachments)} ${plural ? 'are' : 'is'} discarded from ${host} as ${plural ? 'they' : 'it'} ${plural ? 'are' : 'is'} no longer legally attached`);
                    }

                    illegalAttachments.add(card);
                    game.resolveActions([discardFromPlay({ target: Array.from(illegalAttachments) })], context);
                    return true;
                },
                source: 'Too many Restricted attachments'
            });
            return true;
        }
        const copies = this.copiesOverTheLimit(illegalAttachments);
        if(copies.length > 0) {
            // RRG: the card's controller discards copies until only one is attached
            game.promptForSelect(host.controller, {
                activePromptTitle: `Choose which ${copies[0].name} to keep`,
                waitingPromptTitle: 'Waiting for opponent to choose an attachment to keep',
                cardType: CardType.Attachment,
                cardCondition: (card) => copies.includes(card),
                onSelect: (player: Player, kept) => {
                    const discarded = copies.filter((card) => card !== kept);
                    game.addMessage(msg`${player} discards ${discarded} from ${host}, as only one copy can be attached`);
                    if(illegalAttachments.size > 0) {
                        const plural = illegalAttachments.size > 1;
                        game.addMessage(msg`${Array.from(illegalAttachments)} ${plural ? 'are' : 'is'} discarded from ${host} as ${plural ? 'they' : 'it'} ${plural ? 'are' : 'is'} no longer legally attached`);
                    }
                    discarded.forEach((card) => illegalAttachments.add(card));
                    game.resolveActions([discardFromPlay({ target: Array.from(illegalAttachments) })], context);
                    return true;
                },
                source: 'Copies of an attachment'
            });
            return true;
        } else if(illegalAttachments.size > 0) {
            const plural = illegalAttachments.size > 1;
            game.addMessage(msg`${Array.from(illegalAttachments)} ${plural ? 'are' : 'is'} discarded from ${host} as ${plural ? 'they' : 'it'} ${plural ? 'are' : 'is'} no longer legally attached`);
            game.resolveActions([discardFromPlay({ target: Array.from(illegalAttachments) })], context);
            return true;
        }
        return false;
    }

    /** The first set of copies controlled by one player that are attached together, except ones discarded anyway. */
    private copiesOverTheLimit(illegalAttachments: Set<DrawCard>): DrawCard[] {
        if(!this.host.game.rules.attachmentsMaxOneCopyPerName) {
            return [];
        }
        const candidates = this.attachments.filter((card) => !card.allowDuplicatesOfAttachment && !illegalAttachments.has(card));
        for(const card of candidates) {
            const copies = candidates.filter((other) => isCopy(other, card) && other.controller === card.controller);
            if(copies.length > 1) {
                return copies;
            }
        }
        return [];
    }
}

function isCopy(card: DrawCard, other: DrawCard): boolean {
    return card.name === other.name;
}
