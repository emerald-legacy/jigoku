import { msg } from './GameChat.js';
import { CardType, EffectName } from './Constants.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';

export class AttachmentManager {
    attachments: DrawCard[] = [];

    constructor(private readonly host: BaseCard) {}

    remove(attachment: DrawCard): void {
        this.attachments = this.attachments.filter((card) => card.uuid !== attachment.uuid);
    }

    allowAttachment(attachment: DrawCard): boolean {
        if(this.host.allowedAttachmentTraits.some((trait) => attachment.hasTrait(trait))) {
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

        const frameworkLimitsAttachmentsWithRepeatedNames = game.rules.attachmentsMaxOneCopyPerName;
        if(frameworkLimitsAttachmentsWithRepeatedNames) {
            for(const card of this.attachments) {
                const matchingAttachments = this.attachments.filter(
                    (attachment) =>
                        !attachment.allowDuplicatesOfAttachment &&
                        attachment.id === card.id &&
                        attachment.controller === card.controller
                );
                for(const overflow of matchingAttachments.slice(0, -1)) {
                    illegalAttachments.add(overflow);
                }
            }
        }

        for(const object of this.attachments.reduce<Array<Record<string, number>>>(
            (array, card) => array.concat(card.getEffects(EffectName.AttachmentRestrictTraitAmount)),
            []
        )) {
            for(const trait of Object.keys(object)) {
                const matchingAttachments = this.attachments.filter((attachment) => attachment.hasTrait(trait));
                for(const overflow of matchingAttachments.slice(0, -object[trait])) {
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
                    game.applyGameAction(context, { discardFromPlay: Array.from(illegalAttachments) });
                    return true;
                },
                source: 'Too many Restricted attachments'
            });
            return true;
        } else if(illegalAttachments.size > 0) {
            const plural = illegalAttachments.size > 1;
            game.addMessage(msg`${Array.from(illegalAttachments)} ${plural ? 'are' : 'is'} discarded from ${host} as ${plural ? 'they' : 'it'} ${plural ? 'are' : 'is'} no longer legally attached`);
            game.applyGameAction(context, { discardFromPlay: Array.from(illegalAttachments) });
            return true;
        }
        return false;
    }
}
