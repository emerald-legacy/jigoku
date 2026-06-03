import { EffectNames } from './Constants.js';
import { GameModes } from '../GameModes.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';
import type { AbilityContext } from './AbilityContext.js';

export interface CanHostAttachments {
    attachments: DrawCard[];
    removeAttachment(attachment: DrawCard): void;
    allowAttachment(attachment: DrawCard): boolean;
    checkForIllegalAttachments(): boolean;
}

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
        const context = (game.getFrameworkContext as (player?: Player | null) => AbilityContext)(host.controller);
        const illegalAttachments = new Set<DrawCard>(
            this.attachments.filter((attachment) => !host.allowAttachment(attachment) || !attachment.canAttach(host))
        );
        for(const effectCard of host.getEffects(EffectNames.CannotHaveOtherRestrictedAttachments)) {
            for(const card of this.attachments) {
                if(card.isRestricted() && card !== effectCard) {
                    illegalAttachments.add(card);
                }
            }
        }

        const attachmentLimits = this.attachments.filter((card) => card.anyEffect(EffectNames.AttachmentLimit));
        for(const card of attachmentLimits) {
            const limit = Math.max(...card.getEffects<number>(EffectNames.AttachmentLimit));
            const matchingAttachments = this.attachments.filter((attachment) => attachment.id === card.id);
            for(const overflow of matchingAttachments.slice(0, -limit)) {
                illegalAttachments.add(overflow);
            }
        }

        const frameworkLimitsAttachmentsWithRepeatedNames =
            game.gameMode === GameModes.Emerald || game.gameMode === GameModes.Obsidian || game.gameMode === GameModes.Sanctuary;
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
            (array, card) => array.concat(card.getEffects<Record<string, number>>(EffectNames.AttachmentRestrictTraitAmount)),
            []
        )) {
            for(const trait of Object.keys(object)) {
                const matchingAttachments = this.attachments.filter((attachment) => attachment.hasTrait(trait));
                for(const overflow of matchingAttachments.slice(0, -object[trait])) {
                    illegalAttachments.add(overflow);
                }
            }
        }
        const maximumRestricted = 2 + host.sumEffects(EffectNames.ModifyRestrictedAttachmentAmount);
        if(this.attachments.filter((card) => card.isRestricted()).length > maximumRestricted) {
            game.promptForSelect(host.controller, {
                activePromptTitle: 'Choose an attachment to discard',
                waitingPromptTitle: 'Waiting for opponent to choose an attachment to discard',
                cardCondition: (card: DrawCard) => card.parent?.uuid === host.uuid && card.isRestricted(),
                onSelect: (player: Player, card: DrawCard) => {
                    game.addMessage(
                        '{0} discards {1} from {2} due to too many Restricted attachments',
                        player,
                        card,
                        card.parent
                    );

                    if(illegalAttachments.size > 0) {
                        game.addMessage(
                            '{0} {1} discarded from {3} as {2} {1} no longer legally attached',
                            Array.from(illegalAttachments),
                            illegalAttachments.size > 1 ? 'are' : 'is',
                            illegalAttachments.size > 1 ? 'they' : 'it',
                            host
                        );
                    }

                    illegalAttachments.add(card);
                    game.applyGameAction(context, { discardFromPlay: Array.from(illegalAttachments) });
                    return true;
                },
                source: 'Too many Restricted attachments'
            });
            return true;
        } else if(illegalAttachments.size > 0) {
            game.addMessage(
                '{0} {1} discarded from {3} as {2} {1} no longer legally attached',
                Array.from(illegalAttachments),
                illegalAttachments.size > 1 ? 'are' : 'is',
                illegalAttachments.size > 1 ? 'they' : 'it',
                host
            );
            game.applyGameAction(context, { discardFromPlay: Array.from(illegalAttachments) });
            return true;
        }
        return false;
    }
}
