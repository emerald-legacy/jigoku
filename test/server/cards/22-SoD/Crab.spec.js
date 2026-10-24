import { ResolvableAbility } from '../../../../build/server/game/ResolvableAbility.js';
import { sendHome } from '../../../../build/server/game/GameActions/GameActions.js';

describe('SoD - Crab', function () {
    integration(function () {
        describe('A Bad Death', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['a-bad-death']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni', 'doji-challenger'],
                        hand: ['ornate-fan', 'fine-katana', 'banzai']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.badDeath = this.player1.findCardByName('a-bad-death');
            });

            it('should dishonor characters and draw', function () {
                const hand = this.player1.hand.length;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni, this.challenger]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.badDeath);

                this.player1.clickCard(this.badDeath);
                this.player1.clickCard(this.swordsmith);

                expect(this.player1).toHavePrompt('Select a character');
                expect(this.player1).toBeAbleToSelect(this.yokuni);
                expect(this.player1).toBeAbleToSelect(this.challenger);
                this.player1.clickCard(this.yokuni);

                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.yokuni.isDishonored).toBe(true);
                expect(this.player1.hand.length).toBe(hand);
                expect(this.getChatLogs(5)).toContain('player1 plays A Bad Death, dishonoring and sacrificing Agasha Swordsmith to dishonor Togashi Yokuni and draw 1 card');
            });

            it('cannot pay its cost with a character that is already dishonored', function () {
                this.swordsmith.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni, this.challenger]
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard(this.badDeath);
                expect(this.player1).toBeAbleToSelect(this.skirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.swordsmith);
            });

            it('sacrificing berserker', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni, this.challenger]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.badDeath);

                this.player1.clickCard(this.badDeath);
                this.player1.clickCard(this.skirmisher);

                expect(this.player1).toHavePrompt('Select up to 2 characters');
                expect(this.player1).toBeAbleToSelect(this.yokuni);
                expect(this.player1).toBeAbleToSelect(this.challenger);
                this.player1.clickCard(this.yokuni);
                this.player1.clickCard(this.challenger);

                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.yokuni.isDishonored).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 plays A Bad Death, dishonoring and sacrificing Silent Skirmisher to dishonor Togashi Yokuni and Doji Challenger and draw 1 card');
            });

        });

        describe('A Bad Death when the dishonor is replaced', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['a-bad-death']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni', 'kitsuki-shomon']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.badDeath = this.player1.findCardByName('a-bad-death');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.shomon = this.player2.findCardByName('kitsuki-shomon');
            });

            it('still draws a card', function () {
                const hand = this.player1.hand.length;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();
                this.player1.pass();

                this.player1.clickCard(this.badDeath);
                this.player1.clickCard(this.swordsmith);
                this.player1.clickCard(this.yokuni);
                this.player1.clickPrompt('Done');

                this.player2.clickCard(this.shomon);
                expect(this.yokuni.isDishonored).toBe(false);
                expect(this.shomon.isDishonored).toBe(true);
                expect(this.player1.hand.length).toBe(hand);
            });
        });

        describe('Caretaker of The Dead Eyes', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith', 'caretaker-of-the-dead-eyes', 'brash-samurai'],
                        hand: ['a-bad-death']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['assassination']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.deadeyes = this.player1.findCardByName('caretaker-of-the-dead-eyes');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.assassination = this.player2.findCardByName('assassination');
                this.brash = this.player1.findCardByName('brash-samurai');

                this.skirmisher.dishonor();
                this.swordsmith.dishonor();
                this.yokuni.honor();
            });

            it('should rehonor and not cause honor loss and give Courtesy and gain a fate', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith, this.brash],
                    defenders: [this.yokuni]
                });
                const honor = this.player1.honor;
                const fate = this.player1.fate;

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.skirmisher);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.deadeyes);

                this.player1.clickCard(this.deadeyes);
                expect(this.skirmisher.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(honor);
                expect(this.player1.fate).toBe(fate + 1);

                expect(this.getChatLogs(5)).toContain('player1 uses Caretaker of the Dead Eyes to honor Silent Skirmisher and give Courtesy to Silent Skirmisher');
                expect(this.getChatLogs(5)).toContain('player1 gains a fate due to Silent Skirmisher\'s Courtesy');
            });

            it('should rehonor and not cause honor loss but not give Courtesy if not berserker', function () {
                this.brash.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith, this.brash],
                    defenders: [this.yokuni]
                });
                const honor = this.player1.honor;
                const fate = this.player1.fate;

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.brash);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.deadeyes);

                this.player1.clickCard(this.deadeyes);
                expect(this.brash.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(honor);
                expect(this.player1.fate).toBe(fate);

                expect(this.getChatLogs(5)).toContain('player1 uses Caretaker of the Dead Eyes to honor Brash Samurai');
            });

            it('should not trigger if it wont do anything', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith, this.brash],
                    defenders: [this.yokuni]
                });
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.brash);

                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Dead Eyes', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['dead-eyes']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['rout']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.deadeyes = this.player1.findCardByName('dead-eyes');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.rout = this.player2.findCardByName('rout');

                this.yokuni.honor();
            });

            it('should work properly', function () {
                this.player1.clickCard(this.deadeyes);
                expect(this.player1).toBeAbleToSelect(this.skirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.swordsmith);
                this.player1.clickCard(this.skirmisher);

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                const mil = this.skirmisher.militarySkill;
                this.player1.clickCard(this.deadeyes);
                expect(this.skirmisher.militarySkill).toBe(mil + 2);

                expect(this.getChatLogs(5)).toContain('player1 uses Dead Eyes to grant +2military to Silent Skirmisher, prevent them from being moved home. They will be sacrificed if they don\'t win the conflict by enough skill');

                this.player2.clickCard(this.rout);
                expect(this.player2).not.toBeAbleToSelect(this.skirmisher);
                expect(this.player2).toBeAbleToSelect(this.swordsmith);

                this.player2.clickCard(this.swordsmith);

                this.noMoreActions();

                expect(this.skirmisher.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('Silent Skirmisher is sacrificed due to the delayed effect of Dead Eyes');
            });

            it('cannot be moved home by its controller\'s effects either', function () {
                this.player1.clickCard(this.deadeyes);
                this.player1.clickCard(this.skirmisher);

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();
                this.player1.clickCard(this.deadeyes);

                const context = new ResolvableAbility(this.swordsmith, {}).createContext(this.player1.player);
                this.game.queueSimpleStep(() => sendHome().resolve(this.skirmisher, context));
                this.game.continue();
                expect(this.skirmisher.isParticipating()).toBe(true);
            });

            it('cannot be used when the attached character is not participating', function () {
                this.player1.clickCard(this.deadeyes);
                this.player1.clickCard(this.skirmisher);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                const mil = this.skirmisher.militarySkill;
                this.player1.clickCard(this.deadeyes);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.skirmisher.militarySkill).toBe(mil);
            });
        });

        describe('Dead Eyes and a switched conflict type', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['damned-hida'],
                        hand: ['dead-eyes']
                    },
                    player2: {
                        inPlay: [{ card: 'doji-kuwanan', attachments: ['shukujo'] }]
                    }
                });
                this.hida = this.player1.findCardByName('damned-hida');
                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
                this.deadEyes = this.player1.playAttachment('dead-eyes', this.hida);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hida],
                    defenders: [this.kuwanan]
                });
                this.player2.pass();
                this.player1.clickCard(this.deadEyes);
            });

            it('still sends a character home that can no longer participate', function () {
                this.player2.clickCard(this.kuwanan);
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.hida.isParticipating()).toBe(false);
                expect(this.hida.bowed).toBe(true);
                expect(this.getChatLogs(5)).toContain('Damned Hida cannot participate in the conflict any more and is sent home bowed');
            });
        });

        describe('Dead Eyes at the end of the conflict', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['dead-eyes']
                    },
                    player2: {
                        inPlay: ['matsu-berserker']
                    }
                });

                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.deadeyes = this.player1.findCardByName('dead-eyes');
                this.opponentBerserker = this.player2.findCardByName('matsu-berserker');

                this.player1.playAttachment(this.deadeyes, this.berserker);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.berserker],
                    defenders: [this.opponentBerserker]
                });
                this.player2.pass();
                this.player1.clickCard(this.deadeyes);
            });

            it('sacrifices the character only after the ring effect, when it won by less than double', function () {
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.player1).toBeAbleToSelect(this.berserker);
                this.player1.clickCard(this.berserker);
                this.player1.clickPrompt('Honor Matsu Berserker');
                expect(this.berserker.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('Matsu Berserker is sacrificed due to the delayed effect of Dead Eyes');
            });
        });

        describe('Reckless Assault', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['reckless-assault']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni', 'doji-challenger', 'brash-samurai', 'doji-diplomat']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.assault = this.player1.findCardByName('reckless-assault');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.yokuni.honor();
            });

            it('should prevent declaring defenders', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.assault);
                this.player1.clickCard(this.assault);

                expect(this.player2).toHavePrompt('Choose defenders');
                this.player2.clickCard(this.yokuni);
                this.player2.clickCard(this.challenger);
                this.player2.clickCard(this.brash);
                this.player2.clickCard(this.diplomat);

                this.player2.clickPrompt('Done');

                expect(this.yokuni.isParticipating()).toBe(true);
                expect(this.challenger.isParticipating()).toBe(true);
                expect(this.brash.isParticipating()).toBe(false);
                expect(this.diplomat.isParticipating()).toBe(false);

                expect(this.getChatLogs(7)).toContain('player1 plays Reckless Assault to prevent characters with less than 3military from defending (this affects Brash Samurai and Doji Diplomat)');
            });
        });

        describe('Unbridled Assault', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['silent-skirmisher', 'agasha-swordsmith'],
                        hand: ['unbridled-rage']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['rout']
                    }
                });

                this.skirmisher = this.player1.findCardByName('silent-skirmisher');
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.rage = this.player1.findCardByName('unbridled-rage');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
            });

            it('needs a participating Berserker', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                this.player1.clickCard(this.rage);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.rage.location).toBe('hand');
            });

            it('refuse duel', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                const hand = this.player1.hand.length;
                this.player1.clickCard(this.rage);
                expect(this.player1).toBeAbleToSelect(this.skirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.swordsmith);

                this.player1.clickCard(this.skirmisher);

                expect(this.player1).toBeAbleToSelect(this.yokuni);
                this.player1.clickCard(this.yokuni);

                expect(this.player2).toHavePrompt('Do you wish to refuse the duel?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');

                this.player2.clickPrompt('Yes');

                expect(this.player1.hand.length).toBe(hand + 1); // draw 2
                expect(this.player1).toHavePrompt('Conflict Action Window');

                expect(this.getChatLogs(5)).toContain('player2 chooses to refuse the duel, allowing player1 to draw 2 cards and take an additional action');
            });

            it('accept duel', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.skirmisher, this.swordsmith],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                const hand = this.player1.hand.length;
                this.player1.clickCard(this.rage);
                expect(this.player1).toBeAbleToSelect(this.skirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.swordsmith);

                this.player1.clickCard(this.skirmisher);

                expect(this.player1).toBeAbleToSelect(this.yokuni);
                this.player1.clickCard(this.yokuni);

                this.player2.clickPrompt('No');

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1.hand.length).toBe(hand - 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');

                expect(this.getChatLogs(5)).toContain('Duel Effect: prevent Silent Skirmisher from contributing to resolution of this conflict');
                expect(this.getChatLogs(5)).toContain('Military Air conflict - Attacker: 1 Defender: 5');
            });
        });

        describe('Unbridled Assault and a loser that leaves play and returns', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker', 'kitsu-spiritcaller-2'],
                        hand: ['unbridled-rage']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['assassination']
                    }
                });

                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.spiritcaller = this.player1.findCardByName('kitsu-spiritcaller-2');
                this.rage = this.player1.findCardByName('unbridled-rage');
                this.yokuni = this.player2.findCardByName('togashi-yokuni');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('the returned character contributes again', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    defenders: [this.yokuni]
                });
                this.player2.pass();

                this.player1.clickCard(this.rage);
                this.player1.clickCard(this.berserker);
                this.player1.clickCard(this.yokuni);
                this.player2.clickPrompt('No');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(5)).toContain('Duel Effect: prevent Matsu Berserker from contributing to resolution of this conflict');
                expect(this.game.currentConflict.attackerSkill).toBe(0);

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.berserker);
                expect(this.berserker.location).toBe('dynasty discard pile');

                this.player1.clickCard(this.spiritcaller);
                this.player1.clickCard(this.berserker);
                expect(this.berserker.isParticipating()).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(this.berserker.militarySkill);
            });
        });
    });
});

