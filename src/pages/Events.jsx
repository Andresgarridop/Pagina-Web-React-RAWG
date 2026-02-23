import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents } from '../slices/eventsThunks';
import { toggleEventParticipation } from '../slices/eventsSlice';
import { MapPin, Calendar, CheckCircle, PlusCircle } from 'lucide-react';

export default function Events() {
    const dispatch = useDispatch();
    const { list: events, myEvents, isLoading } = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(fetchAllEvents());
    }, [dispatch]);

    const isJoined = (id) => myEvents.some((e) => e.id === id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Eventos de Videojuegos
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Descubre los encuentros más importantes de la industria y únete a la comunidad.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {/* Image Container */}
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                                {event.title}
                            </h3>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <MapPin className="w-4 h-4 text-indigo-400" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    <span>{event.date}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => dispatch(toggleEventParticipation(event))}
                                className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isJoined(event.id)
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                                    }`}
                            >
                                {isJoined(event.id) ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Apuntado
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-5 h-5" />
                                        Apuntarse
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
