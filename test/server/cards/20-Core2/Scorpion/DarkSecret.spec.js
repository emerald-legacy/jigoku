describe('Dark Secret', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves'],
                    hand: ['a-legion-of-one', 'kotobuki-s-blessing']
                },
                player2: {
                    inPlay: [],
                    hand: ['dark-secret']
                }
            });
            this.legion = this.player1.findCardByName('a-legion-of-one');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.adept.fate = 2;

            this.darkSecret = this.player2.findCardByName('dark-secret');

            this.player1.pass();
            this.player2.playAttachment(this.darkSecret, this.adept);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adept],
                defenders: []
            });
            this.player2.pass();
        });

        it('does not trigger when fate is placed on the character', function () {
            this.player1.clickCard('kotobuki-s-blessing');
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('Done');
            expect(this.adept.fate).toBe(3);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('causes honor loss when fate is removed', function () {
            const player1StartHonor = this.player1.honor;
            this.player1.clickCard(this.legion);
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.darkSecret);
            this.player2.clickCard(this.darkSecret);
            expect(this.player1.honor).toBe(player1StartHonor - 1);
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Dark Secret to make player1 lose 1 honor - Three may keep a secret, if two of them are dead'
            );
        });
    });
});

describe('Dark Secret and two fate removals', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['adept-of-the-waves'],
                    hand: ['a-legion-of-one']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-whisperer'],
                    hand: ['dark-secret'],
                    provinces: ['entrenched-position']
                }
            });
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.adept.fate = 2;
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.whisperer.fate = 1;
            this.darkSecret = this.player2.findCardByName('dark-secret');
            this.player1.pass();
            this.player2.playAttachment(this.darkSecret, this.adept);
            expect(this.darkSecret.parent).toBe(this.adept);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'void',
                province: 'entrenched-position',
                attackers: [this.adept],
                defenders: []
            });
            this.player2.pass();
        });

        it('triggers each time fate is removed (Unlimited)', function () {
            this.player1.clickCard('a-legion-of-one');
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
            this.player1.clickCard(this.adept);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.darkSecret);
            expect(this.player1.honor).toBe(9);
            this.noMoreActions();
            this.player1.clickCard(this.adept);
            expect(this.adept.fate).toBe(0);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.darkSecret);
            this.player2.clickCard(this.darkSecret);
            expect(this.player1.honor).toBe(8);
        });
    });
});

describe('Dark Secret on its controller\'s own character', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['adept-of-the-waves'],
                    hand: ['a-legion-of-one']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-whisperer'],
                    hand: ['dark-secret'],
                    provinces: ['entrenched-position']
                }
            });
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.adept.fate = 2;
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.whisperer.fate = 1;
            this.darkSecret = this.player2.findCardByName('dark-secret');
            this.player1.pass();
            this.player2.playAttachment(this.darkSecret, this.whisperer);
            expect(this.darkSecret.parent).toBe(this.whisperer);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'void',
                province: 'entrenched-position',
                attackers: [this.adept],
                defenders: []
            });
            this.player2.pass();
        });

        it('makes the attached character\'s controller lose the honor', function () {
            this.player1.pass();
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.fate).toBe(0);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.darkSecret);
            expect(this.player2.honor).toBe(9); // lost 1 for not defending
            this.player2.clickCard(this.darkSecret);
            expect(this.player2.honor).toBe(8);
            expect(this.player1.honor).toBe(10);
        });
    });
});
