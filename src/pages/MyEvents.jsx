import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleEventParticipation } from '../slices/eventsSlice';
import { Calendar, MapPin, XCircle } from 'lucide-react';

export default function MyEvents() {
    const dispatch = useDispatch();
    const { myEvents } = useSelector((state) => state.events);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-12 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 grid place-items-center">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                        Mis Eventos
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Los eventos en los que has confirmado tu participación.
                    </p>
                </div>
            </div>

            {myEvents.length === 0 ? (
                <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center">
                    <p className="text-slate-500 text-lg">No te has apuntado a ningún evento todavía.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex gap-6 items-center hover:border-indigo-500/30 transition-all"
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                        <MapPin className="w-4 h-4 text-indigo-400" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                        <Calendar className="w-4 h-4 text-purple-400" />
                                        <span>{event.date}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => dispatch(toggleEventParticipation(event))}
                                className="p-3 text-slate-500 hover:text-red-400 transition-colors"
                                title="Cancelar participación"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
