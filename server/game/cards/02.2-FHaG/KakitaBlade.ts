import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
export default class KakitaBlade extends DrawCard {
    static id = 'kakita-blade';

    setupCardAbilities() {
        this.whileAttached({
            condition: () => !!this.attachedCharacter && (this.game.currentDuel?.isInvolvedInAnyDuel(this.attachedCharacter) ?? false),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });

        this.reaction({
            title: 'Gain honor on duel win',
            when: {
                afterDuel: (event: EventPayload<EventName.AfterDuel>, context) => event.winner?.includes(context.source.attachedCharacter as DrawCard) ?? false
            },
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }
}
