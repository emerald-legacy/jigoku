describe('Supply Officer', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['supply-officer', 'doji-challenger']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'miya-mystic'],
                    hand: ['grasp-of-earth-2']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.grasp = this.player2.findCardByName('grasp-of-earth-2');

            this.supply = this.player1.findCardByName('supply-officer');
            this.challenger = this.player1.findCardByName('doji-challenger');
        });

        it('swap locations and ready character at home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu]
            });

            this.challenger.bow();
            this.player2.pass();

            this.player1.clickCard(this.supply);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.supply);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.challenger);

            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.supply);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);

            expect(this.supply.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(true);
            expect(this.challenger.bowed).toBe(true);

            this.player1.clickCard(this.supply);

            expect(this.supply.isParticipating()).toBe(true);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.challenger.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Supply Officer to switch Doji Challenger and Supply Officer');
            expect(this.getChatLogs(5)).toContain('Doji Challenger is readied');
        });

        it('readies the character sent home when the move in is cancelled', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mystic]
            });

            this.challenger.bow();
            this.player2.playAttachment(this.grasp, this.mystic);

            this.player1.clickCard(this.supply);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.supply);

            this.player2.clickCard(this.mystic);

            expect(this.supply.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.challenger.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Supply Officer to switch Doji Challenger and Supply Officer');
            expect(this.getChatLogs(5)).toContain('Doji Challenger is readied');
        });
    });
});

describe('Supply Officer with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['supply-officer', 'doji-whisperer', 'doji-challenger', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher']
                }
            });
            this.supply = this.player1.findCardByName('supply-officer');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('chooses a character on your side, whoever controls it', function () {
            this.player2.pass();
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.supply);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.skirmisher2);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher1);
            this.player1.clickCard(this.skirmisher2);
            this.player1.clickCard(this.challenger);
            expect(this.skirmisher2.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(true);
        });
    });
});

describe('Supply Officer when the send-home is prevented', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['supply-officer', 'matsu-berserker'],
                    hand: ['dead-eyes']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.supply = this.player1.findCardByName('supply-officer');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.deadEyes = this.player1.playAttachment('dead-eyes', this.berserker);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.deadEyes);
            this.player2.pass();
            this.berserker.bow();
        });

        it('cannot switch a character that cannot be moved home', function () {
            expect(this.berserker.isParticipating()).toBe(true);
            this.player1.clickCard(this.supply);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.berserker.isParticipating()).toBe(true);
            expect(this.supply.isParticipating()).toBe(false);
            expect(this.berserker.bowed).toBe(true);
        });
    });
});
