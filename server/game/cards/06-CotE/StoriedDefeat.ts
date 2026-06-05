import CardAbility from '../../CardAbility.js';
import { CardType, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import type { Event } from '../../Events/Event.js';

export default class StoriedDefeat extends DrawCard {
    static id = 'storied-defeat';

    private duelLosersThisConflict = new Set<BaseCard>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel', 'onCharacterEntersPlay']);

        this.action({
            title: 'Bow a character who lost a duel',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => this.duelLosersThisConflict.has(card),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.menuPrompt((context) => ({
                        activePromptTitle: 'Spend 1 fate to dishonor ' + context.target.name + '?',
                        choices: ['Yes'].concat(
                            context.events.some((event: Event) => event.name === EventName.OnCardBowed) ? ['No'] : []
                        ),
                        choiceHandler: (choice, displayMessage) => {
                            if(displayMessage) {
                                context.game.addMessage(
                                    '{0} chooses {1}to spend a fate to dishonor {2}',
                                    context.player,
                                    choice === 'No' ? 'not ' : '',
                                    context.target
                                );
                            }
                            return { amount: choice === 'Yes' ? 1 : 0 };
                        },
                        gameAction: AbilityDsl.actions.joint([
                            AbilityDsl.actions.loseFate({ target: context.player }),
                            AbilityDsl.actions.resolveAbility({
                                target: context.source,
                                subResolution: true,
                                ability: new CardAbility(context.source, {
                                    title: 'Dishonor this character',
                                    gameAction: AbilityDsl.actions.dishonor({ target: context.target })
                                })
                            })
                        ])
                    }))
                ])
            }
        });
    }

    public onConflictFinished() {
        this.duelLosersThisConflict.clear();
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        this.duelLosersThisConflict.delete(event.card);
    }

    public afterDuel(event: EventPayload<EventName.AfterDuel>) {
        if(!event.duel) {
            return;
        }
        if(Array.isArray(event.duel.loser)) {
            (event.duel.loser as BaseCard[]).forEach((duelLoser) => this.duelLosersThisConflict.add(duelLoser));
        } else if(event.duel.loser) {
            this.duelLosersThisConflict.add(event.duel.loser);
        }
    }
}
