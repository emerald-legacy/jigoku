import { msg } from './GameChat.js';
import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { TargetMode, type Blocker } from './Constants.js';
import { payTargetDependentFateCost } from './costs/fateAndHonorCosts.js';
import { attachToRing } from './GameActions/GameActions.js';
import type Ring from './Ring.js';
import type DrawCard from './DrawCard.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';
import { getAttachmentPlayBlocker } from './playActionHelpers.js';

export class PlayAttachmentToRingAction extends PlayCardSourceAction {
    override title = 'Play this attachment';

    constructor(card: DrawCard) {
        super(card, [payTargetDependentFateCost('target')], {
            gameAction: attachToRing((context: AbilityContext<DrawCard>) => ({ attachment: context.source })),
            ringCondition: (ring: Ring) => card.canPlayOn(ring),
            mode: TargetMode.Ring
        });
    }

    override meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []) {
        return getAttachmentPlayBlocker(context, ignoredBlockers) ?? super.meetsRequirements(context, ignoredBlockers);
    }

    override canResolveTargets() {
        return true;
    }

    override displayMessage(context: AbilityContext) {
        context.game.addMessage(msg`${context.player} plays ${context.source}, attaching it to ${context.ring}`);
    }

    override executeHandler(context: AbilityContext<DrawCard>) {
        const cardPlayedEvent = createCardPlayedEvent(context, context.source, context.playType);
        context.game.openEventWindow([
            attachToRing({ attachment: context.source }).getEvent(context.ring, context),
            cardPlayedEvent
        ]);
    }

    override isCardPlayed() {
        return true;
    }
}
