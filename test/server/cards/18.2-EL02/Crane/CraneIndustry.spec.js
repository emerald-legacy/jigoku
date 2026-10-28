describe('Crane Industry', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['crane-industry', 'admit-defeat', 'i-can-swim', 'way-of-the-scorpion', 'i-can-swim']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'doji-kuwanan'],
                    hand: ['a-fate-worse-than-death']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.industry = this.player1.findCardByName('crane-industry');
            this.defeat = this.player1.findCardByName('admit-defeat');
            this.swim = this.player1.filterCardsByName('i-can-swim')[0];
            this.swim2 = this.player1.filterCardsByName('i-can-swim')[1];
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');

            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.afwtd = this.player2.findCardByName('a-fate-worse-than-death');
            this.kuwanan.dishonor();
        });

        it('should react to the conflict starting', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.industry);
        });

        it('should reduce costs of the first copy of each event you play', function() {
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer, this.kuwanan]
            });
            this.player1.clickCard(this.industry);
            expect(this.getChatLogs(5)).toContain('player1 plays Crane Industry to reduce the cost of the first copy of each event they play this conflict by 1');

            let fate = this.player2.fate;
            this.player2.clickCard(this.afwtd);
            this.player2.clickCard(this.challenger);
            expect(this.player2.fate).toBe(fate - 4);

            fate = this.player1.fate;
            this.player1.clickCard(this.scorpion);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate);
            this.player2.pass();
            this.player1.clickCard(this.swim);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate - 1);
            this.player2.pass();
            this.player1.clickCard(this.defeat);
            this.player1.clickCard(this.kuwanan);
            expect(this.player1.fate).toBe(fate - 1);
            this.player2.pass();
            this.player1.clickCard(this.swim2);
            this.player1.clickCard(this.kuwanan);
            expect(this.player1.fate).toBe(fate - 3);
        });

        it('should reset limit in another conflict', function() {
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            expect(this.getChatLogs(5)).toContain('player1 plays Crane Industry to reduce the cost of the first copy of each event they play this conflict by 1');

            let fate = this.player2.fate;
            this.player2.clickCard(this.afwtd);
            this.player2.clickCard(this.challenger);
            expect(this.player2.fate).toBe(fate - 4);

            fate = this.player1.fate;
            this.player1.clickCard(this.scorpion);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate);
            this.player2.pass();
            this.player1.clickCard(this.defeat);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate);
            this.player2.pass();
            this.player1.clickCard(this.swim);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate - 1);
            this.noMoreActions();
            this.player1.moveCard(this.industry, 'hand');

            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: []
            });

            this.player1.clickCard(this.industry);
            expect(this.getChatLogs(5)).toContain('player1 plays Crane Industry to reduce the cost of the first copy of each event they play this conflict by 1');

            fate = this.player1.fate;

            this.player1.clickCard(this.swim2);
            this.player1.clickCard(this.kuwanan);
            expect(this.player1.fate).toBe(fate - 1);
        });
    });
});

describe('Crane Industry and other card types', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['crane-industry', 'reprieve']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.industry = this.player1.findCardByName('crane-industry');
            this.reprieve = this.player1.findCardByName('reprieve');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('does not reduce the cost of attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            this.player2.pass();

            const fate = this.player1.fate;
            this.player1.playAttachment(this.reprieve, this.challenger);
            expect(this.player1.fate).toBe(fate - 1);
        });
    });
});

describe('Crane Industry and events played before the conflict', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['doji-challenger', 'kakita-yoshi'],
                    hand: ['crane-industry', 'calling-in-favors', 'calling-in-favors']
                },
                player2: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['fine-katana', 'ornate-fan'] }]
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.industry = this.player1.findCardByName('crane-industry');
            this.favors = this.player1.filterCardsByName('calling-in-favors');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.katana = this.player2.findCardByName('fine-katana');
            this.fan = this.player2.findCardByName('ornate-fan');
        });

        it('only counts events played during the conflict', function() {
            this.player1.clickCard(this.favors[0]);
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.challenger);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            this.player2.pass();
            const fate = this.player1.fate;
            this.player1.clickCard(this.favors[1]);
            this.player1.clickCard(this.fan);
            this.player1.clickCard(this.yoshi);
            expect(this.fan.location).toBe('play area');
            expect(this.player1.fate).toBe(fate);
        });
    });
});

describe('Crane Industry copied by The Mirror\'s Gaze', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['crane-industry']
                },
                player2: {
                    fate: 5,
                    inPlay: ['doji-whisperer', { card: 'asahina-storyteller', attachments: ['the-mirror-s-gaze'] }],
                    hand: ['peerless-discipline', 'peerless-discipline']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.industry = this.player1.findCardByName('crane-industry');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.gaze = this.player2.findCardByName('the-mirror-s-gaze');
            this.discipline1 = this.player2.filterCardsByName('peerless-discipline')[0];
            this.discipline2 = this.player2.filterCardsByName('peerless-discipline')[1];
        });

        it('should reduce only the first copy of each event the Gaze\'s controller plays', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.gaze);

            const fate = this.player2.fate;
            this.player2.clickCard(this.discipline1);
            expect(this.discipline1.location).toBe('conflict discard pile');
            expect(this.player2.fate).toBe(fate);

            this.player1.pass();
            this.player2.clickCard(this.discipline2);
            expect(this.discipline2.location).toBe('conflict discard pile');
            expect(this.player2.fate).toBe(fate - 1);
        });
    });
});
